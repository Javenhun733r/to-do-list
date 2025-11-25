import { Injectable } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import {
  CreateTodoDTO,
  GetTodosFilterDTO,
  TodoResponseDTO,
  UpdateTodoDTO,
} from '../dto/todo.dto';

@Injectable()
export class TodoMapper {
  toDTO(entity: Todo): TodoResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      status: entity.isDone ? 'done' : 'undone',
      priority: entity.priority,
      dueDate: entity.dueDate ? entity.dueDate.toISOString() : null,
      category: entity.category || 'General',
      order: entity.order,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  toDTOList(entities: Todo[]): TodoResponseDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  toPrismaCreate(
    dto: CreateTodoDTO,
    computedPriority: number,
  ): Prisma.TodoCreateInput {
    return {
      title: dto.title,
      priority: computedPriority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      category: dto.category ?? 'General',
      order: Date.now(),
      isDone: false,
    };
  }

  toPrismaUpdate(
    dto: UpdateTodoDTO,
    computedPriority?: number,
  ): Prisma.TodoUpdateInput {
    return {
      title: dto.title,
      isDone: dto.isDone,
      category: dto.category,
      priority: computedPriority,
      order: typeof dto.order === 'number' ? dto.order : undefined,
      dueDate:
        dto.dueDate === undefined
          ? undefined
          : dto.dueDate
            ? new Date(dto.dueDate)
            : null,
    };
  }

  toPrismaWhere(filters: GetTodosFilterDTO): Prisma.TodoWhereInput {
    const where: Prisma.TodoWhereInput = {};

    if (filters.status === 'done') where.isDone = true;
    if (filters.status === 'undone') where.isDone = false;

    if (filters.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    return where;
  }

  toPrismaOrderBy(
    filters: GetTodosFilterDTO,
  ): Prisma.TodoOrderByWithRelationInput[] {
    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';

    return [{ isDone: 'asc' }, { [sortField]: sortOrder }];
  }
}
