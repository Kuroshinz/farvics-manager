export interface IBusinessPolicy<T> {
  isApplicable(context: T): boolean;
  enforce(context: T): void;
}

export abstract class BusinessPolicy<T> implements IBusinessPolicy<T> {
  abstract isApplicable(context: T): boolean;
  abstract enforce(context: T): void;
}
