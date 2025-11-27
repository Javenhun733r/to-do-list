import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DEFAULT_PRIORITY,
  MAX_PRIORITY,
  MIN_PRIORITY,
} from '../common/constants';
import {
  CreateTodoDTO,
  GetTodosFilterDTO,
  TodoResponseDTO,
  UpdateTodoDTO,
} from './dto/todo.dto';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly repo: TodoRepository) {}

  createTodo(dto: CreateTodoDTO): Promise<TodoResponseDTO> {
    const priority = this.clampPriority(dto.priority);
    return this.repo.create(dto, priority);
  }

  getTodos(filters: GetTodosFilterDTO): Promise<TodoResponseDTO[]> {
    return this.repo.findAll(filters);
  }

  async updateTodo(id: string, dto: UpdateTodoDTO): Promise<TodoResponseDTO> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    let priority: number | undefined;
    if (dto.priority !== undefined) {
      priority = this.clampPriority(dto.priority);
    }

    return this.repo.update(id, dto, priority);
  }

  deleteTodo(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  private clampPriority(priority?: number): number {
    return Math.min(
      Math.max(priority || DEFAULT_PRIORITY, MIN_PRIORITY),
      MAX_PRIORITY,
    );
  }
}
