import { EventEmitter2 } from '@nestjs/event-emitter';
import { DomainError } from '../../common/errors/domain.error';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './domain/todo.model';
import {
  TODO_REPOSITORY,
  TodoRepositoryPort,
} from './application/ports/todo.repository.port';
import { TODO_CREATED_EVENT } from './application/events/todo-created.event';
import { TodosService } from './application/todos.service';

describe('TodosService', () => {
  let todosService: TodosService;
  let mockTodoRepository: jest.Mocked<TodoRepositoryPort>;
  let mockEventEmitter: jest.Mocked<Pick<EventEmitter2, 'emit'>>;

  const inputTodo: Todo = {
    id: 'todo-1',
    title: 'Test todo',
    isCompleted: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    mockTodoRepository = {
      save: jest.fn(),
      findAllByUserId: jest.fn(),
      findByIdForUser: jest.fn(),
      count: jest.fn(),
    };
    mockEventEmitter = {
      emit: jest.fn(),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: TODO_REPOSITORY,
          useValue: mockTodoRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();
    todosService = app.get<TodosService>(TodosService);
  });

  describe('createTodo', () => {
    it('should create a todo and emit integration event', async () => {
      mockTodoRepository.save.mockResolvedValue(inputTodo);
      const actualResult = await todosService.createTodo('user-1', 'Test todo');
      expect(mockTodoRepository.save.mock.calls[0]).toEqual([
        'user-1',
        'Test todo',
        false,
      ]);
      expect(actualResult).toEqual(inputTodo);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        TODO_CREATED_EVENT,
        expect.objectContaining({ id: inputTodo.id, title: inputTodo.title }),
      );
    });
  });

  describe('findAllTodos', () => {
    it('should return todos from repository', async () => {
      mockTodoRepository.findAllByUserId.mockResolvedValue([inputTodo]);
      const actualResult = await todosService.findAllTodos('user-1');
      expect(actualResult).toHaveLength(1);
      expect(actualResult[0].id).toBe(inputTodo.id);
    });
  });

  describe('findTodoById', () => {
    it('should return a todo when found', async () => {
      mockTodoRepository.findByIdForUser.mockResolvedValue(inputTodo);
      const actualResult = await todosService.findTodoById('user-1', 'todo-1');
      expect(actualResult.id).toBe('todo-1');
    });

    it('should throw DomainError when todo is missing', async () => {
      mockTodoRepository.findByIdForUser.mockResolvedValue(null);
      await expect(
        todosService.findTodoById('user-1', 'missing'),
      ).rejects.toThrow(DomainError);
    });
  });

  describe('getTestResponse', () => {
    it('should return ok status', () => {
      expect(todosService.getTestResponse()).toEqual({ status: 'ok' });
    });
  });
});
