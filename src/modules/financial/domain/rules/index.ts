export interface IBusinessRule {
  readonly message: string;
  isBroken(): boolean;
}

export abstract class BusinessRule implements IBusinessRule {
  abstract readonly message: string;
  abstract isBroken(): boolean;
}
