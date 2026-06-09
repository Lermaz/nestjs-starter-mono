import { DomainError } from './domain.error';
import { assertEmailAvailable } from './registration.rules';

describe('assertEmailAvailable', () => {
  it('should pass when no user exists', () => {
    expect(() => assertEmailAvailable(null)).not.toThrow();
  });

  it('should throw when email is already registered', () => {
    const existingUser = {
      id: 'user-1',
      email: 'user@example.com',
      passwordHash: 'hash',
      createdAt: new Date(),
    };
    expect(() => assertEmailAvailable(existingUser)).toThrow(DomainError);
  });
});
