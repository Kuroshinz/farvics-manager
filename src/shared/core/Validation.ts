import { Result } from './Result';

export interface IValidator<T> {
  validate(target: T): Promise<Result<void>>;
}

export interface IValidationPipeline {
  validate<T>(target: T, validator: IValidator<T>): Promise<Result<void>>;
  validateMany<T>(targets: T[], validator: IValidator<T>): Promise<Result<void>[]>;
}
