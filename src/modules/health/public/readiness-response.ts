/**
 * Readiness check response exposed for cross-module consumers.
 */
export interface ReadinessResponse {
  readonly status: string;
  readonly todosCount: number;
}
