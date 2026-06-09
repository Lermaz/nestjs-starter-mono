import { User } from '../../domain/user.model';
import { UserEntity } from '../entities/user.entity';

/**
 * Maps a persistence entity to a domain user.
 */
export function toDomainUser(entity: UserEntity): User {
  return {
    id: entity.id,
    email: entity.email,
    passwordHash: entity.passwordHash,
    createdAt: entity.createdAt,
  };
}

/**
 * Maps user credentials to a new persistence entity shape.
 */
export function toNewUserEntity(
  email: string,
  passwordHash: string,
): Pick<UserEntity, 'email' | 'passwordHash' | 'createdAt'> {
  return {
    email,
    passwordHash,
    createdAt: new Date(),
  };
}
