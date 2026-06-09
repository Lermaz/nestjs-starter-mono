import { Test, TestingModule } from '@nestjs/testing';
import { TodosPublicApi } from '../todos/public/todos-public.api';
import { HealthService } from './application/health.service';
import { HealthController } from './presentation/health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let mockTodosPublicApi: jest.Mocked<Pick<TodosPublicApi, 'countTodos'>>;

  beforeEach(async () => {
    mockTodosPublicApi = {
      countTodos: jest.fn().mockResolvedValue(0),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: TodosPublicApi,
          useValue: mockTodosPublicApi,
        },
      ],
    }).compile();
    healthController = app.get<HealthController>(HealthController);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(healthController.getHello()).toBe('Hello World!');
    });
  });

  describe('getTest', () => {
    it('should return ok status', () => {
      expect(healthController.getTest()).toEqual({ status: 'ok' });
    });
  });

  describe('getReadiness', () => {
    it('should return readiness with todos count', async () => {
      mockTodosPublicApi.countTodos.mockResolvedValue(1);
      const actualResult = await healthController.getReadiness();
      expect(actualResult).toEqual({ status: 'ok', todosCount: 1 });
    });
  });
});
