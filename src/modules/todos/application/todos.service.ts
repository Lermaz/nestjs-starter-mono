import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from '../presentation/dto/create-todo.dto';
import { TodoResponseDto } from '../presentation/dto/todo-response.dto';
import { TodoEntity } from '../infrastructure/entities/todo.entity';
import {
  TODO_REPOSITORY,
  TodoRepositoryPort,
} from './ports/todo.repository.port';

/**
 * Application service for todo business operations.
 */
@Injectable()
export class TodosService {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly todoRepository: TodoRepositoryPort,
  ) {}

  /**
   * Creates a new todo from the given input.
   */
  async createTodo(input: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.create(
      input.title,
      input.isCompleted ?? false,
    );
    return this.mapToResponse(todo);
  }

  /**
   * Returns all todos.
   */
  async findAllTodos(): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepository.findAll();
    return todos.map((todo) => this.mapToResponse(todo));
  }

  /**
   * Returns a single todo by id.
   */
  async findTodoById(id: string): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return this.mapToResponse(todo);
  }

  /**
   * Returns a smoke test response for the todos module.
   */
  getTestResponse(): { status: string } {
    return { status: 'ok' };
  }

  private mapToResponse(todo: TodoEntity): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      isCompleted: todo.isCompleted,
      createdAt: todo.createdAt,
    };
  }
}
