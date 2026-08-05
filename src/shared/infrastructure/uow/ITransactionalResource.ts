export interface ITransactionalResource {
  readonly name: string;
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
