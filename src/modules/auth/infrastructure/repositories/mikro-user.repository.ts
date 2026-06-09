import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../application/ports/user.repository.port';
import { UserEntity } from '../entities/user.entity';

/**
 * MikroORM implementation of the user repository port.
 */
@Injectable()
export class MikroUserRepository implements UserRepositoryPort {
  constructor(private readonly entityManager: EntityManager) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.entityManager.findOne(UserEntity, { email });
  }

  async create(email: string, passwordHash: string): Promise<UserEntity> {
    const user = this.entityManager.create(UserEntity, {
      email,
      passwordHash,
      createdAt: new Date(),
    });
    await this.entityManager.persist(user).flush();
    return user;
  }
}
