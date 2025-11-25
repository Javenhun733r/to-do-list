import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable()
export class CategoriesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CategoryMapper,
  ) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return this.mapper.toResponseDtoList(categories);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const data = this.mapper.toPrismaCreate(dto);

    const category = await this.prisma.category.create({ data }).catch(() => {
      throw new ConflictException('Category exists');
    });
    return this.mapper.toResponseDto(category);
  }
}
