import { err, ok } from '../../../common/result/result.helpers';
import type { Result } from '../../../common/result/result';
import { DomainError } from './domain.error';
import { User } from './user.model';

const MIN_PASSWORD_LENGTH = 8;

/**
 * Ensures a password meets registration policy.
 */
export function assertPasswordMeetsPolicy(
  password: string,
): Result<void, DomainError> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return err(
      new DomainError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      ),
    );
  }
  return ok(undefined);
}

/**
 * Ensures an email is available for registration.
 */
export function assertEmailAvailable(
  existingUser: User | null,
): Result<void, DomainError> {
  if (existingUser) {
    return err(new DomainError('Email is already registered', 409));
  }
  return ok(undefined);
}
