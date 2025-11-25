import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CategoryMapper } from './mappers/category.mapper';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, CategoryMapper],
})
export class CategoriesModule {}
