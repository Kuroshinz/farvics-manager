import { Journal, JournalStatus } from './JournalEngine';
import { AccountingPeriod } from '../Calendar';

export class PostingPolicies {
  static validatePeriod(journal: Journal, period: AccountingPeriod): void {
    if (period.isClosed) {
      throw new Error('Cannot post journal into a closed accounting period');
    }
    if (!period.contains(journal.date)) {
      throw new Error('Journal date falls outside the provided accounting period');
    }
  }
}

export class PostingEngine {
  post(journal: Journal, period: AccountingPeriod): Journal {
    if (journal.status !== JournalStatus.DRAFT) {
      throw new Error('Journal is not in DRAFT status');
    }
    PostingPolicies.validatePeriod(journal, period);
    
    // The journal object itself mutates its status since it is the aggregate root protecting its state lifecycle
    journal.markPosted();
    return journal;
  }
}
