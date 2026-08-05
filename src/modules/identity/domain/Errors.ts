export class IdentityError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = 'IdentityError';
  }
}

export const IdentityErrors = {
  USER_NOT_FOUND: new IdentityError('USER_NOT_FOUND', 'The requested user does not exist.'),
  UNAUTHORIZED: new IdentityError('UNAUTHORIZED', 'Invalid credentials or missing permissions.'),
  INVALID_PROFILE_DATA: new IdentityError('INVALID_PROFILE_DATA', 'The provided profile data is invalid.'),
  CONCURRENCY_CONFLICT: new IdentityError('CONCURRENCY_CONFLICT', 'User was modified by another transaction.'),
};
