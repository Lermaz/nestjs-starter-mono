import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.model';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { UserEntity } from '../entities/user.entity';
import { toDomainUser, toNewUserEntity } from '../mappers/user.mapper';

/**
 * MikroORM implementation of the user repository port.
 */
@Injectable()
export class MikroUserRepository implements UserRepositoryPort {
  constructor(private readonly entityManager: EntityManager) {}

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.entityManager.findOne(UserEntity, { email });
    if (!entity) {
      return null;
    }
    return toDomainUser(entity);
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.entityManager.findOne(UserEntity, { id });
    if (!entity) {
      return null;
    }
    return toDomainUser(entity);
  }

  async save(email: string, passwordHash: string): Promise<User> {
    const entity = this.entityManager.create(
      UserEntity,
      toNewUserEntity(email, passwordHash),
    );
    await this.entityManager.persist(entity).flush();
    return toDomainUser(entity);
  }
}
