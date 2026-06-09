import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TODO_REPOSITORY } from './application/ports/todo.repository.port';
import { TodosService } from './application/todos.service';
import { TodoEntity } from './infrastructure/entities/todo.entity';
import { MikroTodoRepository } from './infrastructure/repositories/mikro-todo.repository';
import { TodosPublicApi } from './public/todos-public.api';
import { TodosController } from './presentation/todos.controller';

/**
 * Todos feature module with CRUD endpoints and repository pattern.
 */
@Module({
  imports: [MikroOrmModule.forFeature([TodoEntity])],
  controllers: [TodosController],
  providers: [
    TodosService,
    TodosPublicApi,
    {
      provide: TODO_REPOSITORY,
      useClass: MikroTodoRepository,
    },
  ],
  exports: [TodosPublicApi],
})
export class TodosModule {}
