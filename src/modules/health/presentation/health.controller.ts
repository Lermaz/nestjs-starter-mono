import { Controller, Get } from '@nestjs/common';
import { HealthService } from '../application/health.service';

/**
 * Controller for health check endpoints.
 */
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Root health endpoint.
   */
  @Get()
  getHello(): string {
    return this.healthService.getHello();
  }

  /**
   * Smoke test endpoint for health module verification.
   */
  @Get('health/test')
  getTest(): { status: string } {
    return this.healthService.getTestResponse();
  }
}
