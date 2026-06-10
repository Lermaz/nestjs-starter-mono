import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Todo } from '../../domain/todo.model';
import { TodoRepositoryPort } from '../../application/ports/todo.repository.port';
import { TodoEntity } from '../entities/todo.entity';
import { toDomainTodo, toNewTodoEntity } from '../mappers/todo.mapper';

/**
 * MikroORM implementation of the todo repository port.
 */
@Injectable()
export class MikroTodoRepository implements TodoRepositoryPort {
  constructor(private readonly entityManager: EntityManager) {}

  async save(
    userId: string,
    title: string,
    isCompleted: boolean,
  ): Promise<Todo> {
    const entity = this.entityManager.create(
      TodoEntity,
      toNewTodoEntity(userId, title, isCompleted),
    );
    await this.entityManager.persist(entity).flush();
    return toDomainTodo(entity);
  }

  async findAllByUserId(userId: string): Promise<Todo[]> {
    const entities = await this.entityManager.find(
      TodoEntity,
      { userId },
      { orderBy: { createdAt: 'desc' } },
    );
    return entities.map((entity) => toDomainTodo(entity));
  }

  async findByIdForUser(userId: string, id: string): Promise<Todo | null> {
    const entity = await this.entityManager.findOne(TodoEntity, { id, userId });
    if (!entity) {
      return null;
    }
    return toDomainTodo(entity);
  }

  async count(): Promise<number> {
    return this.entityManager.count(TodoEntity, {});
  }
}
