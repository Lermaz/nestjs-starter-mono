import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { HealthModule } from './modules/health/health.module';

/**
 * Root application module that wires core and feature modules.
 */
@Module({
  imports: [CoreModule, HealthModule],
})
export class AppModule {}
