import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

interface TodoCreatedPayload {
  readonly id: string;
  readonly title: string;
}

/**
 * Handles todo integration events for cross-cutting side effects.
 */
@Injectable()
export class TodoCreatedListener {
  private readonly logger = new Logger(TodoCreatedListener.name);

  @OnEvent('todo.created')
  handleTodoCreated(payload: TodoCreatedPayload): void {
    this.logger.log(`Todo created: ${payload.id} - ${payload.title}`);
  }
}
