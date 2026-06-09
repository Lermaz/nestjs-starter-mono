/**
 * Domain model for a todo item.
 */
export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly isCompleted: boolean;
  readonly createdAt: Date;
}

/**
 * Properties required to create a new todo.
 */
export interface CreateTodoProps {
  readonly title: string;
  readonly isCompleted: boolean;
}
