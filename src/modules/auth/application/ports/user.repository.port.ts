import { CreateUserProps, User } from '../../domain/user.model';

/**
 * Contract for user persistence operations.
 */
export interface UserRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(props: CreateUserProps): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
