import { MikroORM } from '@mikro-orm/core';
import { Injectable, OnModuleInit } from '@nestjs/common';

/**
 * Ensures database schema exists on application startup.
 */
@Injectable()
export class DatabaseSchemaService implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    const generator = this.orm.getSchemaGenerator();
    await generator.updateSchema();
  }
}
