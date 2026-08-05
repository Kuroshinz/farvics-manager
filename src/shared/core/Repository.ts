export interface IReadRepository<T, IdType = string> {
  findById(id: IdType): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export interface IRepository<T, IdType = string> extends IReadRepository<T, IdType> {
  save(entity: T): Promise<void>;
  delete(entity: T): Promise<void>;
}

export interface IAggregateRepository<T, IdType = string> extends IRepository<T, IdType> {
  save(entity: T, expectedVersion?: number): Promise<void>;
}
