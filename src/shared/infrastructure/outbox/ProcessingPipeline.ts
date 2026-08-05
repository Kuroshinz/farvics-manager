import { OutboxMessage } from './OutboxContracts';
import { EventDeserializer, EventEnvelope } from '../../events/serialization';

export interface IProjectionExecutor { execute(envelope: EventEnvelope<unknown>): Promise<void>; }
export interface IIntegrationExecutor { execute(envelope: EventEnvelope<unknown>): Promise<void>; }

export class ProcessingPipeline {
  constructor(
    private readonly deserializer: EventDeserializer,
    private readonly projectionExecutor: IProjectionExecutor,
    private readonly integrationExecutor: IIntegrationExecutor
  ) {}

  async process(message: OutboxMessage, payloadStr: string): Promise<void> {
    const envelope = this.deserializer.deserialize<unknown>(payloadStr);
    
    await this.projectionExecutor.execute(envelope);
    await this.integrationExecutor.execute(envelope);
  }
}
