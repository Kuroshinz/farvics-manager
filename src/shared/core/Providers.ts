export interface IClock {
  now(): Date;
}

export interface IIdGenerator {
  generate(): string;
}

export interface ICurrentUserProvider {
  getCurrentUserId(): Promise<string | null>;
}
