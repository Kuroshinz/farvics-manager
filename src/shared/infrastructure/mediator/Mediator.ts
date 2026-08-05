import { IMediator, ICommand, IQuery, ICommandHandler, IQueryHandler, IPipelineBehavior } from '../../application/Pipeline';
import { IServiceProvider, Token } from '../../composition/DI';

export class Mediator implements IMediator {
  private commandHandlers = new Map<string, Token<any>>();
  private queryHandlers = new Map<string, Token<any>>();

  constructor(private readonly provider: IServiceProvider) {}

  registerCommand<TCommand extends ICommand, TResult>(commandName: string, handlerToken: Token<ICommandHandler<TCommand, TResult>>): void {
    this.commandHandlers.set(commandName, handlerToken);
  }

  registerQuery<TQuery extends IQuery, TResult>(queryName: string, handlerToken: Token<IQueryHandler<TQuery, TResult>>): void {
    this.queryHandlers.set(queryName, handlerToken);
  }

  private async executePipeline<TRequest, TResponse>(
    request: TRequest,
    handler: (req: TRequest) => Promise<TResponse>,
    behaviors: IPipelineBehavior<TRequest, TResponse>[]
  ): Promise<TResponse> {
    let index = -1;
    const dispatch = async (i: number): Promise<TResponse> => {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      if (i === behaviors.length) {
        return await handler(request);
      }
      const behavior = behaviors[i];
      if (behavior.beforeExecute) await behavior.beforeExecute(request);
      
      let response: TResponse;
      try {
        response = await behavior.handle(request, () => dispatch(i + 1));
        if (behavior.afterExecute) await behavior.afterExecute(request, response);
        return response;
      } catch (error) {
        if (behavior.handleError) {
          await behavior.handleError(request, error);
        }
        throw error;
      }
    };
    return dispatch(0);
  }

  async send<TResult>(command: ICommand & { constructor: { name: string } }): Promise<TResult> {
    const handlerToken = this.commandHandlers.get(command.constructor.name);
    if (!handlerToken) throw new Error(`No handler registered for command: ${command.constructor.name}`);
    
    const handler = this.provider.resolve<ICommandHandler<typeof command, TResult>>(handlerToken);
    const behaviors = this.provider.resolveMany<IPipelineBehavior<typeof command, TResult>>('IPipelineBehavior');
    
    return this.executePipeline(command, (cmd) => handler.handle(cmd), behaviors);
  }

  async query<TResult>(query: IQuery & { constructor: { name: string } }): Promise<TResult> {
    const handlerToken = this.queryHandlers.get(query.constructor.name);
    if (!handlerToken) throw new Error(`No handler registered for query: ${query.constructor.name}`);
    
    const handler = this.provider.resolve<IQueryHandler<typeof query, TResult>>(handlerToken);
    const behaviors = this.provider.resolveMany<IPipelineBehavior<typeof query, TResult>>('IPipelineBehavior');
    
    return this.executePipeline(query, (q) => handler.handle(q), behaviors);
  }
}
