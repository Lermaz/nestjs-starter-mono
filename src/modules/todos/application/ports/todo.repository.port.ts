import { Todo } from '../../domain/todo.model';

/**
 * Contract for todo persistence operations.
 */
export interface TodoRepositoryPort {
  save(userId: string, title: string, isCompleted: boolean): Promise<Todo>;
  findAllByUserId(userId: string): Promise<Todo[]>;
  findByIdForUser(userId: string, id: string): Promise<Todo | null>;
  count(): Promise<number>;
}

export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');
