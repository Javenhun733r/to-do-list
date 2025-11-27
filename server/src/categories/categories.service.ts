import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '@/categories/categories.repository';
import { CreateCategoryDto } from '@/categories/dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  create(dto: CreateCategoryDto) {
    return this.repo.create(dto);
  }
}
