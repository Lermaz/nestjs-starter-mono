import { Test, TestingModule } from '@nestjs/testing';
import type { AuthTokenPayload } from '../auth/public';
import { Todo } from './domain/todo.model';
import { TodosService } from './application/todos.service';
import { TodosController } from './presentation/todos.controller';

describe('TodosController', () => {
  let todosController: TodosController;
  let mockTodosService: jest.Mocked<
    Pick<
      TodosService,
      'createTodo' | 'findAllTodos' | 'findTodoById' | 'getTestResponse'
    >
  >;

  const inputUser: AuthTokenPayload = {
    userId: 'user-1',
    email: 'user@example.com',
  };

  const expectedTodo: Todo = {
    id: 'todo-1',
    title: 'Test todo',
    isCompleted: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    mockTodosService = {
      createTodo: jest.fn(),
      findAllTodos: jest.fn(),
      findTodoById: jest.fn(),
      getTestResponse: jest.fn(),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();
    todosController = app.get<TodosController>(TodosController);
  });

  describe('getTest', () => {
    it('should return ok status', () => {
      mockTodosService.getTestResponse.mockReturnValue({ status: 'ok' });
      expect(todosController.getTest()).toEqual({ status: 'ok' });
    });
  });

  describe('createTodo', () => {
    it('should delegate to service and map response', async () => {
      mockTodosService.createTodo.mockResolvedValue(expectedTodo);
      const actualResult = await todosController.createTodo(inputUser, {
        title: 'Test todo',
      });
      expect(mockTodosService.createTodo).toHaveBeenCalledWith(
        'user-1',
        'Test todo',
        false,
      );
      expect(actualResult).toEqual(expectedTodo);
    });
  });

  describe('findAllTodos', () => {
    it('should delegate to service and map responses', async () => {
      mockTodosService.findAllTodos.mockResolvedValue([expectedTodo]);
      const actualResult = await todosController.findAllTodos(inputUser);
      expect(actualResult).toEqual([expectedTodo]);
    });
  });

  describe('findTodoById', () => {
    it('should delegate to service and map response', async () => {
      mockTodosService.findTodoById.mockResolvedValue(expectedTodo);
      const actualResult = await todosController.findTodoById(
        inputUser,
        'todo-1',
      );
      expect(actualResult).toEqual(expectedTodo);
    });
  });
});
