import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Inject,
  Injectable,
} from '../../../common/nest/application.decorators';
import { DomainError } from '../../../common/errors/domain.error';
import { err, ok } from '../../../common/result/result.helpers';
import type { Result } from '../../../common/result/result';
import { createTodoProps } from '../domain/todo.factory';
import { Todo } from '../domain/todo.model';
import {
  TODO_CREATED_EVENT,
  TodoCreatedEvent,
} from './events/todo-created.event';
import { TODO_REPOSITORY } from './ports/todo.repository.port';
import type { TodoRepositoryPort } from './ports/todo.repository.port';

/**
 * Application service for todo business operations.
 */
@Injectable()
export class TodosService {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepositoryPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new todo from the given input.
   */
  async createTodo(
    userId: string,
    title: string,
    isCompleted = false,
  ): Promise<Result<Todo, DomainError>> {
    const propsResult = createTodoProps(title, isCompleted);
    if (!propsResult.ok) {
      return propsResult;
    }
    const todo = await this.todoRepository.save({
      userId,
      props: propsResult.value,
    });
    this.eventEmitter.emit(
      TODO_CREATED_EVENT,
      new TodoCreatedEvent(todo.id, todo.title),
    );
    return ok(todo);
  }

  /**
   * Returns all todos for a user.
   */
  async findAllTodos(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAllByUserId(userId);
  }

  /**
   * Returns a single todo by id for the given user.
   */
  async findTodoById(
    userId: string,
    id: string,
  ): Promise<Result<Todo, DomainError>> {
    const todo = await this.todoRepository.findByIdForUser(userId, id);
    if (!todo) {
      return err(new DomainError(`Todo with id "${id}" not found`, 404));
    }
    return ok(todo);
  }

  /**
   * Returns a smoke test response for the todos module.
   */
  getTestResponse(): { status: string } {
    return { status: 'ok' };
  }
}
