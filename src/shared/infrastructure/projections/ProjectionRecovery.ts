import { ProjectionRebuilder } from '../../../modules/financial/projections/repair';
import { ProjectionCheckpoint } from '../../../modules/financial/projections/metadata';
import { ILogger } from '../../core/Logger';

export class ProjectionRecovery implements ProjectionRebuilder {
  constructor(private readonly logger: ILogger) {}

  async rebuildAll(projectionName: string): Promise<void> {
    this.logger.info(`Rebuilding entirely: ${projectionName}`);
  }

  async rebuildFromCheckpoint(projectionName: string, checkpoint: ProjectionCheckpoint): Promise<void> {
    this.logger.info(`Rebuilding ${projectionName} from checkpoint ${checkpoint.cursor.position}`);
  }
}
