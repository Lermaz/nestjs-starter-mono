import { Module } from '@nestjs/common';
import { DomainExceptionFilter } from './filters/domain-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

/**
 * Shared module for cross-cutting utilities reused across feature modules.
 */
@Module({
  providers: [DomainExceptionFilter, HttpExceptionFilter, LoggingInterceptor],
  exports: [DomainExceptionFilter, HttpExceptionFilter, LoggingInterceptor],
})
export class CommonModule {}
