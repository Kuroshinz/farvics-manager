export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  CONCURRENCY_ERROR = 'CONCURRENCY_ERROR',
  INFRASTRUCTURE_FAILURE = 'INFRASTRUCTURE_FAILURE'
}

export interface ResultError {
  readonly code: ErrorCode;
  readonly message: string;
}

export class ValidationFailure implements ResultError {
  public readonly code = ErrorCode.VALIDATION_ERROR;
  constructor(public readonly message: string) {}
}

export class BusinessFailure implements ResultError {
  public readonly code = ErrorCode.BUSINESS_RULE_VIOLATION;
  constructor(public readonly message: string) {}
}

export class InfrastructureFailure implements ResultError {
  public readonly code = ErrorCode.INFRASTRUCTURE_FAILURE;
  constructor(public readonly message: string) {}
}

export class ConcurrencyFailure implements ResultError {
  public readonly code = ErrorCode.CONCURRENCY_ERROR;
  constructor(public readonly message: string) {}
}

export class AuthorizationFailure implements ResultError {
  public readonly code = ErrorCode.UNAUTHORIZED;
  constructor(public readonly message: string) {}
}

export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly error: ResultError | null;
  private readonly _value: T | null;

  private constructor(isSuccess: boolean, error?: ResultError | null, value?: T) {
    if (isSuccess && error) {
      throw new Error("InvalidOperation: A result cannot be successful and contain an error");
    }
    if (!isSuccess && !error) {
      throw new Error("InvalidOperation: A failing result needs to contain an error message");
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error || null;
    this._value = value ?? null;
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Can't get the value of an error result. Use 'getError' instead.");
    }
    return this._value as T;
  }

  public getError(): ResultError | null {
    return this.error;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: ResultError): Result<U> {
    return new Result<U>(false, error);
  }
}
