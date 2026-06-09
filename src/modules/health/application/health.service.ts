import { Injectable } from '@nestjs/common';

/**
 * Service for health check operations.
 */
@Injectable()
export class HealthService {
  /**
   * Returns a hello world message for the root health endpoint.
   */
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Returns a smoke test response for health verification.
   */
  getTestResponse(): { status: string } {
    return { status: 'ok' };
  }
}
