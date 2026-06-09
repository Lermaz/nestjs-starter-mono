import { Injectable } from '@nestjs/common';
import { TodosPublicApi } from '../../todos/public/todos-public.api';

export interface ReadinessResponse {
  readonly status: string;
  readonly todosCount: number;
}

/**
 * Service for health check operations.
 */
@Injectable()
export class HealthService {
  constructor(private readonly todosPublicApi: TodosPublicApi) {}

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

  /**
   * Returns readiness status including database connectivity via Todos.
   */
  async getReadiness(): Promise<ReadinessResponse> {
    const todosCount = await this.todosPublicApi.countTodos();
    return { status: 'ok', todosCount };
  }
}
