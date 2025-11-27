import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Category name is too long (max 50 chars)' })
  name: string;
}
