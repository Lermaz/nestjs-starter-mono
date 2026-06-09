import { Module } from '@nestjs/common';
import { TodosModule } from '../todos/todos.module';
import { HealthService } from './application/health.service';
import { HealthController } from './presentation/health.controller';

/**
 * Health module for application status and smoke test endpoints.
 */
@Module({
  imports: [TodosModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
