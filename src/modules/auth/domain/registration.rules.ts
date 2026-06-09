import { DomainError } from './domain.error';
import { User } from './user.model';

/**
 * Ensures an email is available for registration.
 */
export function assertEmailAvailable(existingUser: User | null): void {
  if (existingUser) {
    throw new DomainError('Email is already registered');
  }
}
