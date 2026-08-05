import { IBusinessRule } from '../rules';

export interface IDomainValidator<T> { validate(entity: T): IBusinessRule[]; }
export interface IInvariantValidator<T> { checkInvariants(entity: T): void; }

export class MoneyValidator implements IDomainValidator<any> { validate(entity: any): IBusinessRule[] { return []; } }
export class AccountValidator implements IDomainValidator<any> { validate(entity: any): IBusinessRule[] { return []; } }
export class BudgetValidator implements IDomainValidator<any> { validate(entity: any): IBusinessRule[] { return []; } }
export class JournalValidator implements IDomainValidator<any> { validate(entity: any): IBusinessRule[] { return []; } }
export class CategoryValidator implements IDomainValidator<any> { validate(entity: any): IBusinessRule[] { return []; } }
