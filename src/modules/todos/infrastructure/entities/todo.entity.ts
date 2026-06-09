import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'node:crypto';

/**
 * Persistence model for a todo item.
 */
@Entity({ tableName: 'todos' })
export class TodoEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ length: 255 })
  title!: string;

  @Property()
  isCompleted: boolean = false;

  @Property()
  createdAt: Date = new Date();
}
