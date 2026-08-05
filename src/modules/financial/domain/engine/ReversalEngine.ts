import { Journal, JournalStatus } from './JournalEngine';
import { TransactionNumber } from '../Identifiers';
import { BusinessDate } from '../Calendar';
import { PostingEngine } from './PostingEngine';
import { AccountingPeriod } from '../Calendar';

export class ReversalEngine {
  constructor(private readonly postingEngine: PostingEngine) {}

  reverse(originalJournal: Journal, newDate: BusinessDate, period: AccountingPeriod, reversalId: TransactionNumber): Journal {
    if (originalJournal.status !== JournalStatus.POSTED) {
      throw new Error('Cannot reverse a journal that is not POSTED');
    }

    const reversedEntries = originalJournal.entries.map(entry => entry.invert());
    
    const reversalJournal = new Journal(
      reversalId,
      newDate,
      reversedEntries,
      `Reversal of ${originalJournal.id.value}`,
      JournalStatus.DRAFT,
      originalJournal.id
    );

    // Enforce posting rules on the new reversal journal
    this.postingEngine.post(reversalJournal, period);
    
    // Mark original as reversed
    originalJournal.markReversed();

    return reversalJournal;
  }
}
