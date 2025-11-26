import { Injectable } from '@nestjs/common';
import { TodoNotFoundException } from 'src/exceptions/todo.exceptions';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTodoDTO,
  GetTodosFilterDTO,
  TodoResponseDTO,
  UpdateTodoDTO,
} from './dto/todo.dto';
import { TodoMapper } from './mappers/todo.mapper';

@Injectable()
export class TodoRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: TodoMapper,
  ) {}

  async create(dto: CreateTodoDTO, priority: number): Promise<TodoResponseDTO> {
    const data = this.mapper.toPrismaCreate(dto, priority);
    const todo = await this.prisma.todo.create({ data });
    return this.mapper.toDTO(todo);
  }

  async findAll(filters: GetTodosFilterDTO): Promise<TodoResponseDTO[]> {
    const where = this.mapper.toPrismaWhere(filters);
    const orderBy = this.mapper.toPrismaOrderBy(filters);

    const todos = await this.prisma.todo.findMany({ where, orderBy });
    return this.mapper.toDTOList(todos);
  }

  async findById(id: string): Promise<TodoResponseDTO | null> {
    const todo = await this.prisma.todo
      .findUnique({ where: { id } })
      .catch(() => {
        throw new TodoNotFoundException(id);
      });
    return todo ? this.mapper.toDTO(todo) : null;
  }

  async update(
    id: string,
    dto: UpdateTodoDTO,
    priority?: number,
  ): Promise<TodoResponseDTO> {
    const data = this.mapper.toPrismaUpdate(dto, priority);
    const todo = await this.prisma.todo
      .update({ where: { id }, data })
      .catch(() => {
        throw new TodoNotFoundException(id);
      });
    return this.mapper.toDTO(todo);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.todo.delete({ where: { id } }).catch(() => {
      throw new TodoNotFoundException(id);
    });
  }
}
