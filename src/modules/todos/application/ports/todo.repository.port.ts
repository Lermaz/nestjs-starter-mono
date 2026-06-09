import { TodoEntity } from '../../infrastructure/entities/todo.entity';

/**
 * Contract for todo persistence operations.
 */
export interface TodoRepositoryPort {
  create(title: string, isCompleted?: boolean): Promise<TodoEntity>;
  findAll(): Promise<TodoEntity[]>;
  findById(id: string): Promise<TodoEntity | null>;
  count(): Promise<number>;
}

export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');
