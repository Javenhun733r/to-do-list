import { Category } from '@prisma/client';

export class CategoryResponseDto {
  id: string;
  name: string;

  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
  }
}
