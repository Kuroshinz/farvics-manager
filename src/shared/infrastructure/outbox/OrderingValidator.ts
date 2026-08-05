import { IOrderingGuarantee } from './OutboxContracts';

export interface IAggregateVersionStore {
  getLastProcessedVersion(aggregateId: string): Promise<number>;
}

export class OrderingValidator implements IOrderingGuarantee {
  constructor(private readonly versionStore: IAggregateVersionStore) {}

  async verifySequence(aggregateId: string, version: number): Promise<boolean> {
    const lastVersion = await this.versionStore.getLastProcessedVersion(aggregateId);
    return version === lastVersion + 1;
  }
}
