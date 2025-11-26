import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDTO, UpdateTodoDTO } from './dto/todo.dto';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  const mockTodoRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTodo', () => {
    it('should call repository with clamped priority (max 10)', async () => {
      const dto: CreateTodoDTO = { title: 'High Priority Task', priority: 100 };
      const expectedPriority = 10;

      await service.createTodo(dto);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(
        dto,
        expectedPriority,
      );
    });

    it('should call repository with clamped priority (min 1)', async () => {
      const dto: CreateTodoDTO = { title: 'Low Priority Task', priority: -5 };
      const expectedPriority = 1;

      await service.createTodo(dto);

      expect(mockTodoRepository.create).toHaveBeenCalledWith(
        dto,
        expectedPriority,
      );
    });
  });

  describe('updateTodo', () => {
    it('should update todo and clamp priority if provided', async () => {
      const dto: UpdateTodoDTO = { priority: 15 };
      const id = 'uuid';
      const expectedPriority = 10;

      await service.updateTodo(id, dto);

      expect(mockTodoRepository.update).toHaveBeenCalledWith(
        id,
        dto,
        expectedPriority,
      );
    });
  });
});
