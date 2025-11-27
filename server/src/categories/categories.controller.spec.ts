import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '@/categories/categories.controller';
import { CategoriesService } from '@/categories/categories.service';
import { CreateCategoryDto } from '@/categories/dto/create-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategoriesService = {
    create: jest.fn((dto: CreateCategoryDto) => {
      return {
        id: 'uuid',
        name: dto.name,
      };
    }),
    findAll: jest.fn(() => {
      return [
        {
          id: 'uuid',
          name: 'Test Category',
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDto = { name: 'Work' };

      const result = await controller.create(dto);

      expect(result).toEqual({
        id: 'uuid',
        name: 'Work',
      });

      expect(mockCategoriesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([
        {
          id: 'uuid',
          name: 'Test Category',
        },
      ]);

      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });
});
