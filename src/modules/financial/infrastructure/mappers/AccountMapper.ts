import { AccountAggregate } from '../../domain/aggregates';
import { AccountNumber } from '../../domain/Identifiers';

export class AccountMapper {
  static toDomain(raw: any): AccountAggregate {
    const account = new AccountAggregate();
    account.version = raw.version;
    // Map id, name, currency, etc.
    return account;
  }

  static toPersistence(domain: AccountAggregate): any {
    return {
      version: domain.version,
      // Map other fields
    };
  }
}
