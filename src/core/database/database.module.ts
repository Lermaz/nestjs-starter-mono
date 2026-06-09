import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../config/database.config';
import { buildMikroOrmOptions } from './mikro-orm.config';
import { DatabaseSchemaService } from './database-schema.service';

/**
 * Database module that configures the MikroORM connection.
 */
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<DatabaseConfig['url']>(
          'database.url',
          'sqlite://./data/app.db',
        );
        return {
          ...buildMikroOrmOptions(databaseUrl),
          driver: SqliteDriver,
        };
      },
    }),
  ],
  providers: [DatabaseSchemaService],
})
export class DatabaseModule {}
