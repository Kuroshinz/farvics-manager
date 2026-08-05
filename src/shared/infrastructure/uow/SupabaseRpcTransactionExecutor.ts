import { ITransactionExecutor, SerializableOperation } from './ITransactionExecutor';

export class SupabaseRpcTransactionExecutor implements ITransactionExecutor {
  constructor(private readonly supabase: any) {}

  async executeTransaction(operations: SerializableOperation[], idempotencyKey?: string): Promise<void> {
    const { data, error } = await this.supabase.rpc('execute_transaction_batch', {
      ops: operations,
      idemp_key: idempotencyKey
    });

    if (error) {
      // Pass along specific PG error codes (e.g. 40001 serialization failure, 40P01 deadlock)
      throw Object.assign(new Error(`RPC Transaction failed: ${error.message}`), { code: error.code });
    }
  }
}
