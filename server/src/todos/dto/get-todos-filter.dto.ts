import { IsEnum, IsOptional, IsString } from 'class-validator';

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
