import { DomainError } from './domain.error';
import { createTodoProps } from './todo.factory';

describe('createTodoProps', () => {
  it('should return trimmed title and completion flag', () => {
    const actualProps = createTodoProps('  Buy groceries  ', true);
    expect(actualProps).toEqual({
      title: 'Buy groceries',
      isCompleted: true,
    });
  });

  it('should default isCompleted to false', () => {
    const actualProps = createTodoProps('Task');
    expect(actualProps.isCompleted).toBe(false);
  });

  it('should throw when title is empty', () => {
    expect(() => createTodoProps('   ')).toThrow(DomainError);
  });

  it('should throw when title exceeds max length', () => {
    const longTitle = 'a'.repeat(256);
    expect(() => createTodoProps(longTitle)).toThrow(DomainError);
  });
});
