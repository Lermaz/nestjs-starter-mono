import { DomainError } from './domain.error';
import {
  assertEmailAvailable,
  assertPasswordMeetsPolicy,
} from './registration.rules';

describe('assertPasswordMeetsPolicy', () => {
  it('should pass when password meets minimum length', () => {
    const actualResult = assertPasswordMeetsPolicy('password123');
    expect(actualResult.ok).toBe(true);
  });

  it('should fail when password is too short', () => {
    const actualResult = assertPasswordMeetsPolicy('short');
    expect(actualResult.ok).toBe(false);
    if (!actualResult.ok) {
      expect(actualResult.error).toBeInstanceOf(DomainError);
    }
  });
});

describe('assertEmailAvailable', () => {
  it('should pass when no user exists', () => {
    const actualResult = assertEmailAvailable(null);
    expect(actualResult.ok).toBe(true);
  });

  it('should fail when email is already registered', () => {
    const existingUser = {
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hash',
      createdAt: new Date(),
    };
    const actualResult = assertEmailAvailable(existingUser);
    expect(actualResult.ok).toBe(false);
    if (!actualResult.ok) {
      expect(actualResult.error).toBeInstanceOf(DomainError);
    }
  });
});
