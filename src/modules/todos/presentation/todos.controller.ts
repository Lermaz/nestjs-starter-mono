import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../../common/decorators/public.decorator';
import { TodosService } from '../application/todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoResponseDto } from './dto/todo-response.dto';

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
  createTodo(@Body() input: CreateTodoDto): Promise<TodoResponseDto> {
    return this.todosService.createTodo(input);
  }

  /**
   * Returns all todos.
   */
  @Get()
  @ApiOperation({ summary: 'List all todos' })
  @ApiResponse({ status: 200, type: TodoResponseDto, isArray: true })
  findAllTodos(): Promise<TodoResponseDto[]> {
    return this.todosService.findAllTodos();
  }

  /**
   * Returns a single todo by id.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiResponse({ status: 200, type: TodoResponseDto })
  findTodoById(@Param('id') id: string): Promise<TodoResponseDto> {
    return this.todosService.findTodoById(id);
  }
}
