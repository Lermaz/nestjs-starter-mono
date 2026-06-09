import { Test, TestingModule } from '@nestjs/testing';
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

  const expectedTodo = {
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
    it('should delegate to service', async () => {
      mockTodosService.createTodo.mockResolvedValue(expectedTodo);
      const actualResult = await todosController.createTodo({
        title: 'Test todo',
      });
      expect(mockTodosService.createTodo).toHaveBeenCalledWith({
        title: 'Test todo',
      });
      expect(actualResult).toEqual(expectedTodo);
    });
  });

  describe('findAllTodos', () => {
    it('should delegate to service', async () => {
      mockTodosService.findAllTodos.mockResolvedValue([expectedTodo]);
      const actualResult = await todosController.findAllTodos();
      expect(actualResult).toEqual([expectedTodo]);
    });
  });

  describe('findTodoById', () => {
    it('should delegate to service', async () => {
      mockTodosService.findTodoById.mockResolvedValue(expectedTodo);
      const actualResult = await todosController.findTodoById('todo-1');
      expect(actualResult).toEqual(expectedTodo);
    });
  });
});
