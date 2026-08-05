import { IValidator } from '../../../../shared/core/Validation';
import { Result } from '../../../../shared/core/Result';
import { CreateJournalRequest } from '../dto';

export class CreateJournalValidator implements IValidator<CreateJournalRequest> {
  async validate(target: CreateJournalRequest): Promise<Result<void>> {
    if (!target.entries || target.entries.length < 2) {
      return Result.fail({ code: 'VALIDATION_ERROR' as any, message: 'At least two entries are required' });
    }
    return Result.ok();
  }
}
