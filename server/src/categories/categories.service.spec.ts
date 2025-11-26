import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockCategoriesRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [{ id: '1', name: 'Work' }];
      mockCategoriesRepository.findAll.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should call create method of repository', async () => {
      const dto = { name: 'New Category' };
      await service.create(dto);

      expect(mockCategoriesRepository.create).toHaveBeenCalledWith(dto);
    });
  });
});
