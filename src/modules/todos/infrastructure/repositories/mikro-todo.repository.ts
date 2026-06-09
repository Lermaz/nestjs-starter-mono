import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { TodoRepositoryPort } from '../../application/ports/todo.repository.port';
import { TodoEntity } from '../entities/todo.entity';

/**
 * MikroORM implementation of the todo repository port.
 */
@Injectable()
export class MikroTodoRepository implements TodoRepositoryPort {
  constructor(private readonly entityManager: EntityManager) {}

  async create(title: string, isCompleted = false): Promise<TodoEntity> {
    const todo = new TodoEntity();
    todo.title = title;
    todo.isCompleted = isCompleted;
    await this.entityManager.persist(todo).flush();
    return todo;
  }

  async findAll(): Promise<TodoEntity[]> {
    return this.entityManager.find(TodoEntity, {}, { orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<TodoEntity | null> {
    return this.entityManager.findOne(TodoEntity, { id });
  }
}
