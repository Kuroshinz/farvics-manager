import { IIdGenerator } from '../../core/Providers';

export class FakeIdGenerator implements IIdGenerator {
  private nextId = 1;
  private predefinedIds: string[] = [];

  generate(): string {
    if (this.predefinedIds.length > 0) {
      return this.predefinedIds.shift()!;
    }
    return `fake-id-${this.nextId++}`;
  }

  setNextIds(ids: string[]): void {
    this.predefinedIds = [...ids];
  }
}
