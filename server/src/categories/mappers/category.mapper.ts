import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryMapper {
  toPrismaCreate(dto: CreateCategoryDto): Prisma.CategoryCreateInput {
    return {
      name: dto.name,
    };
  }

  toResponseDto(category: Category): CategoryResponseDto {
    return new CategoryResponseDto(category);
  }

  toResponseDtoList(categories: Category[]): CategoryResponseDto[] {
    return categories.map((category) => this.toResponseDto(category));
  }
}
