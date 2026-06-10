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

/**
 * Command for persisting a new todo for a user.
 */
export interface SaveTodoCommand {
  readonly userId: string;
  readonly props: CreateTodoProps;
}
