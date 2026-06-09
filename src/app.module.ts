import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { TodosModule } from './modules/todos/todos.module';

/**
 * Root application module that wires core and feature modules.
 */
@Module({
  imports: [CoreModule, AuthModule, HealthModule, TodosModule],
})
export class AppModule {}
