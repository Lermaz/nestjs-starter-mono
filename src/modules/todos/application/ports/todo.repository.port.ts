import { Todo } from '../../domain/todo.model';

/**
 * Contract for todo persistence operations.
 */
export interface TodoRepositoryPort {
  save(title: string, isCompleted: boolean): Promise<Todo>;
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  count(): Promise<number>;
}

export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');
