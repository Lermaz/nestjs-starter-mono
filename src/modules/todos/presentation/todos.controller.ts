import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { unwrapDomainResult } from '../../../common/result';
import type { AuthTokenPayload } from '../../auth/public';
import { TodosService } from '../application/todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoResponseDto } from './dto/todo-response.dto';
import { toTodoResponseDto } from './mappers/todo-response.mapper';

/**
 * HTTP controller for todo operations.
 */
@ApiTags('todos')
@ApiBearerAuth()
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  /**
   * Smoke test endpoint for todos module verification.
   */
  @Public()
  @Get('admin/test')
  @ApiOperation({ summary: 'Todos module smoke test' })
  @ApiResponse({ status: 200, description: 'OK status' })
  getTest(): { status: string } {
    return this.todosService.getTestResponse();
  }

  /**
   * Creates a new todo.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({ status: 201, type: TodoResponseDto })
  async createTodo(
    @CurrentUser() user: AuthTokenPayload,
    @Body() input: CreateTodoDto,
  ): Promise<TodoResponseDto> {
    const result = await this.todosService.createTodo(
      user.userId,
      input.title,
      input.isCompleted ?? false,
    );
    return toTodoResponseDto(unwrapDomainResult(result));
  }

  /**
   * Returns all todos.
   */
  @Get()
  @ApiOperation({ summary: 'List all todos' })
  @ApiResponse({ status: 200, type: TodoResponseDto, isArray: true })
  async findAllTodos(
    @CurrentUser() user: AuthTokenPayload,
  ): Promise<TodoResponseDto[]> {
    const todos = await this.todosService.findAllTodos(user.userId);
    return todos.map((todo) => toTodoResponseDto(todo));
  }

  /**
   * Returns a single todo by id.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiResponse({ status: 200, type: TodoResponseDto })
  async findTodoById(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
  ): Promise<TodoResponseDto> {
    const result = await this.todosService.findTodoById(user.userId, id);
    return toTodoResponseDto(unwrapDomainResult(result));
  }
}
