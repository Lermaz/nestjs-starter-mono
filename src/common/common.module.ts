import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

/**
 * Shared module for cross-cutting utilities reused across feature modules.
 */
@Module({
  providers: [HttpExceptionFilter, LoggingInterceptor],
  exports: [HttpExceptionFilter, LoggingInterceptor],
})
export class CommonModule {}
