import { DomainError } from './domain.error';
import { CreateTodoProps } from './todo.model';

const MAX_TITLE_LENGTH = 255;

/**
 * Validates and returns properties for a new todo.
 */
export function createTodoProps(
  title: string,
  isCompleted = false,
): CreateTodoProps {
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    throw new DomainError('Todo title cannot be empty');
  }
  if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    throw new DomainError(
      `Todo title cannot exceed ${MAX_TITLE_LENGTH} characters`,
    );
  }
  return { title: trimmedTitle, isCompleted };
}
