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

  async save(title: string, isCompleted: boolean): Promise<Todo> {
    const entity = this.entityManager.create(
      TodoEntity,
      toNewTodoEntity(title, isCompleted),
    );
    await this.entityManager.persist(entity).flush();
    return toDomainTodo(entity);
  }

  async findAll(): Promise<Todo[]> {
    const entities = await this.entityManager.find(
      TodoEntity,
      {},
      { orderBy: { createdAt: 'desc' } },
    );
    return entities.map((entity) => toDomainTodo(entity));
  }

  async findById(id: string): Promise<Todo | null> {
    const entity = await this.entityManager.findOne(TodoEntity, { id });
    if (!entity) {
      return null;
    }
    return toDomainTodo(entity);
  }

  async count(): Promise<number> {
    return this.entityManager.count(TodoEntity, {});
  }
}
