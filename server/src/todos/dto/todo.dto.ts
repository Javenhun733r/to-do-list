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
  Min,
} from 'class-validator';

export class CreateTodoDTO {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
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
  @IsDateString()
  dueDate?: string | null;

  @IsOptional()
  @IsString()
  category?: string;
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
}

export interface TodoResponseDTO {
  id: string;
  title: string;
  status: 'done' | 'undone';
  priority: number;
  dueDate: string | null;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
