import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './application/health.service';
import { HealthController } from './presentation/health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
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
});
