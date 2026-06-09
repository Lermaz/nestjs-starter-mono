import { Test, TestingModule } from '@nestjs/testing';
import { TodosPublicApi } from '../todos/public/todos-public.api';
import { HealthService } from './application/health.service';

describe('HealthService', () => {
  let healthService: HealthService;
  let mockTodosPublicApi: jest.Mocked<Pick<TodosPublicApi, 'countTodos'>>;

  beforeEach(async () => {
    mockTodosPublicApi = {
      countTodos: jest.fn(),
    };
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: TodosPublicApi,
          useValue: mockTodosPublicApi,
        },
      ],
    }).compile();
    healthService = app.get<HealthService>(HealthService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(healthService.getHello()).toBe('Hello World!');
    });
  });

  describe('getTestResponse', () => {
    it('should return ok status', () => {
      expect(healthService.getTestResponse()).toEqual({ status: 'ok' });
    });
  });

  describe('getReadiness', () => {
    it('should return ok status with todos count', async () => {
      mockTodosPublicApi.countTodos.mockResolvedValue(2);
      const actualResult = await healthService.getReadiness();
      expect(actualResult).toEqual({ status: 'ok', todosCount: 2 });
      expect(mockTodosPublicApi.countTodos).toHaveBeenCalled();
    });
  });
});
