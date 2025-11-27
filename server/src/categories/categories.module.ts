import { Module } from '@nestjs/common';
import { CategoriesController } from '@/categories/categories.controller';
import { CategoriesRepository } from '@/categories/categories.repository';
import { CategoriesService } from '@/categories/categories.service';
import { CategoryMapper } from '@/categories/mappers/category.mapper';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, CategoryMapper],
})
export class CategoriesModule {}
