import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TodosService } from '../application/todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoResponseDto } from './dto/todo-response.dto';

/**
 * HTTP controller for todo operations.
 */
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  /**
   * Smoke test endpoint for todos module verification.
   */
  @Get('admin/test')
  getTest(): { status: string } {
    return this.todosService.getTestResponse();
  }

  /**
   * Creates a new todo.
   */
  @Post()
  createTodo(@Body() input: CreateTodoDto): Promise<TodoResponseDto> {
    return this.todosService.createTodo(input);
  }

  /**
   * Returns all todos.
   */
  @Get()
  findAllTodos(): Promise<TodoResponseDto[]> {
    return this.todosService.findAllTodos();
  }

  /**
   * Returns a single todo by id.
   */
  @Get(':id')
  findTodoById(@Param('id') id: string): Promise<TodoResponseDto> {
    return this.todosService.findTodoById(id);
  }
}
