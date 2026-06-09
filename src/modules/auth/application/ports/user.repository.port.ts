import { User } from '../../domain/user.model';

/**
 * Contract for user persistence operations.
 */
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  save(email: string, passwordHash: string): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
