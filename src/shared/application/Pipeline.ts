export interface ICommand {}

export interface IQuery {}

export interface ICommandHandler<TCommand extends ICommand, TResult> {
  handle(command: TCommand): Promise<TResult>;
}

export interface IQueryHandler<TQuery extends IQuery, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

export type RequestHandlerDelegate<TResponse> = () => Promise<TResponse>;

export interface IPipelineBehavior<TRequest, TResponse> {
  beforeExecute?(request: TRequest): Promise<void>;
  afterExecute?(request: TRequest, response: TResponse): Promise<void>;
  handleError?(request: TRequest, error: unknown): Promise<void>;
  handle(request: TRequest, next: RequestHandlerDelegate<TResponse>): Promise<TResponse>;
}

export interface IMediator {
  send<TResult>(command: ICommand): Promise<TResult>;
  query<TResult>(query: IQuery): Promise<TResult>;
}

export interface IApplicationService<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
