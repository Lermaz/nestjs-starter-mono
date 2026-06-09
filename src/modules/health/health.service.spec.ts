import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './application/health.service';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
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
});
