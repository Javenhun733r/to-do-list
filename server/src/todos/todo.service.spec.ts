import { CreateTodoDTO, UpdateTodoDTO } from '@/todos/dto/todo.dto';
import { TodoRepository } from '@/todos/todo.repository';
import { TodoService } from '@/todos/todo.service';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

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
    jest.clearAllMocks();

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

    it('should throw BadRequestException if update DTO is empty', async () => {
      const dto: UpdateTodoDTO = {};
      const id = 'uuid';

      await expect(service.updateTodo(id, dto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockTodoRepository.update).not.toHaveBeenCalled();
    });
  });
});
