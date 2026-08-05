export interface CommandId { readonly value: string; }
export interface TransactionId { readonly value: string; }
export interface IdempotencyKey { readonly value: string; readonly commandName: string; }

export class IdempotencyStrategy {
  static generateKey(commandName: string, commandId: string): string {
    return `${commandName}:${commandId}`;
  }
}
