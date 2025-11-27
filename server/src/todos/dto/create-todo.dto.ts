import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { MAX_PRIORITY, MIN_PRIORITY } from 'src/common/constants';

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
