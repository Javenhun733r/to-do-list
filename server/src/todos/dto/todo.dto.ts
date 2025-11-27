import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MAX_PRIORITY, MIN_PRIORITY } from '../../common/constants';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Title is too long (max 255 chars)' })
  title!: string;

  @IsOptional()
  @IsInt()
  @Min(MIN_PRIORITY)
  @Max(MAX_PRIORITY)
  priority?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

export class UpdateTodoDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'Title is too long (max 255 chars)' })
  title?: string;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @IsOptional()
  @IsNumber()
  order?: number;
}
export class GetTodosFilterDTO {
  @IsOptional()
  @IsEnum(['done', 'undone', 'all'])
  status?: 'done' | 'undone' | 'all';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'priority' | 'dueDate' | 'order' | 'createdAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  category?: string;
}

export interface TodoResponseDTO {
  id: string;
  title: string;
  isDone: boolean;
  priority: number;
  dueDate: string | null;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
