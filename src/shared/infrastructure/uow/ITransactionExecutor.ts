export interface SerializableOperation {
  table: string;
  action: 'insert' | 'update' | 'delete';
  payload?: any;
  match?: any;
}

export interface ITransactionExecutor {
  executeTransaction(operations: SerializableOperation[], idempotencyKey?: string): Promise<void>;
}
