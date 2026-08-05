import { OutboxMessage, ProcessingMode } from './OutboxContracts';
import { EventDeserializer } from '../../events/serialization';
import { IProjectionExecutor, IIntegrationExecutor } from './ProcessingPipeline';
import { IReplaySafetyPolicy } from './OutboxContracts';

export class ReplayPipeline {
  constructor(
    private readonly deserializer: EventDeserializer,
    private readonly projectionExecutor: IProjectionExecutor,
    private readonly integrationExecutor: IIntegrationExecutor,
    private readonly safetyPolicy: IReplaySafetyPolicy
  ) {}

  async process(message: OutboxMessage, payloadStr: string, mode: ProcessingMode): Promise<void> {
    const envelope = this.deserializer.deserialize<unknown>(payloadStr);

    if (this.safetyPolicy.canUpdateProjection(mode)) {
      await this.projectionExecutor.execute(envelope);
    }

    if (this.safetyPolicy.canPublishIntegrationEvent(mode)) {
      await this.integrationExecutor.execute(envelope);
    }
  }
}
