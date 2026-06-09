import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { appConfig } from './config/app.config';

/**
 * Core module that registers global configuration and cross-cutting providers.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class CoreModule {}
