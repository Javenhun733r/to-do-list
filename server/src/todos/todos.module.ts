import { TodoMapper } from '@/todos/mappers/todo.mapper';
import { TodoController } from '@/todos/todo.controller';
import { TodoRepository } from '@/todos/todo.repository';
import { TodoService } from '@/todos/todo.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, TodoMapper],
})
export class TodosModule {}
