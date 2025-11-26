import { Injectable } from '@nestjs/common';
import { Prisma, Todo } from '@prisma/client';
import { DEFAULT_CATEGORY } from 'src/common/constants';
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

      isDone: entity.isDone,

      priority: entity.priority,
      dueDate: entity.dueDate ? entity.dueDate.toISOString() : null,
      category: (entity.categoryName as string) || DEFAULT_CATEGORY,
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
      category: { connect: { name: dto.category ?? DEFAULT_CATEGORY } },
      order: Date.now(),
      isDone: false,
    };
  }

  toPrismaUpdate(
    dto: UpdateTodoDTO,
    computedPriority?: number,
  ): Prisma.TodoUpdateInput {
    const categoryUpdate: Prisma.TodoUpdateInput['category'] =
      dto.category === undefined
        ? undefined
        : { connect: { name: dto.category } };

    return {
      title: dto.title,
      isDone: dto.isDone,

      priority: computedPriority,
      order: typeof dto.order === 'number' ? dto.order : undefined,
      dueDate:
        dto.dueDate === undefined
          ? undefined
          : dto.dueDate
            ? new Date(dto.dueDate)
            : null,

      category: categoryUpdate,
    };
  }

  toPrismaWhere(filters: GetTodosFilterDTO): Prisma.TodoWhereInput {
    const where: Prisma.TodoWhereInput = {};

    if (filters.status === 'done') where.isDone = true;
    if (filters.status === 'undone') where.isDone = false;

    if (filters.search) {
      where.title = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters.category && filters.category.toLowerCase() !== 'all') {
      where.category = { name: filters.category };
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
