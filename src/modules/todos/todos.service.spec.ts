import { NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoEntity } from './infrastructure/entities/todo.entity';
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

  const inputTodo: TodoEntity = {
    id: 'todo-1',
    title: 'Test todo',
    isCompleted: false,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    mockTodoRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
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
    it('should create and map a todo', async () => {
      mockTodoRepository.create.mockResolvedValue(inputTodo);
      const actualResult = await todosService.createTodo({
        title: 'Test todo',
      });
      expect(mockTodoRepository.create.mock.calls[0]).toEqual([
        'Test todo',
        false,
      ]);
      expect(actualResult).toEqual({
        id: inputTodo.id,
        title: inputTodo.title,
        isCompleted: inputTodo.isCompleted,
        createdAt: inputTodo.createdAt,
      });
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        TODO_CREATED_EVENT,
        expect.objectContaining({ id: inputTodo.id, title: inputTodo.title }),
      );
    });
  });

  describe('findAllTodos', () => {
    it('should return mapped todos', async () => {
      mockTodoRepository.findAll.mockResolvedValue([inputTodo]);
      const actualResult = await todosService.findAllTodos();
      expect(actualResult).toHaveLength(1);
      expect(actualResult[0].id).toBe(inputTodo.id);
    });
  });

  describe('findTodoById', () => {
    it('should return a mapped todo when found', async () => {
      mockTodoRepository.findById.mockResolvedValue(inputTodo);
      const actualResult = await todosService.findTodoById('todo-1');
      expect(actualResult.id).toBe('todo-1');
    });

    it('should throw NotFoundException when todo is missing', async () => {
      mockTodoRepository.findById.mockResolvedValue(null);
      await expect(todosService.findTodoById('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getTestResponse', () => {
    it('should return ok status', () => {
      expect(todosService.getTestResponse()).toEqual({ status: 'ok' });
    });
  });
});
