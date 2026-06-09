import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from '../common/common.module';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { databaseConfig } from './config/database.config';
import { DatabaseModule } from './database/database.module';

/**
 * Core module that registers global configuration and cross-cutting providers.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
    }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    CommonModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useExisting: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useExisting: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class CoreModule {}
