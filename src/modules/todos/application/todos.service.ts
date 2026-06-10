import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
  ): Promise<Todo> {
    const props = createTodoProps(title, isCompleted);
    const todo = await this.todoRepository.save(
      userId,
      props.title,
      props.isCompleted,
    );
    this.eventEmitter.emit(
      TODO_CREATED_EVENT,
      new TodoCreatedEvent(todo.id, todo.title),
    );
    return todo;
  }

  /**
   * Returns all todos.
   */
  async findAllTodos(userId: string): Promise<Todo[]> {
    return this.todoRepository.findAllByUserId(userId);
  }

  /**
   * Returns a single todo by id for the given user.
   */
  async findTodoById(userId: string, id: string): Promise<Todo> {
    const todo = await this.todoRepository.findByIdForUser(userId, id);
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return todo;
  }

  /**
   * Returns a smoke test response for the todos module.
   */
  getTestResponse(): { status: string } {
    return { status: 'ok' };
  }
}
