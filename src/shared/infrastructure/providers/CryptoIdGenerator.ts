import { IIdGenerator } from '../../core/Providers';
import { randomUUID } from 'crypto';

export class CryptoIdGenerator implements IIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
