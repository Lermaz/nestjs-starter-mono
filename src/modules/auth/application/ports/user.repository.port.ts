import { UserEntity } from '../../infrastructure/entities/user.entity';

/**
 * Contract for user persistence operations.
 */
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserEntity | null>;
  create(email: string, passwordHash: string): Promise<UserEntity>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
