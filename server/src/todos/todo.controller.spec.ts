import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDTO, GetTodosFilterDTO, UpdateTodoDTO } from './dto/index';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let controller: TodoController;

  const mockTodoService = {
    createTodo: jest.fn((dto: CreateTodoDTO) => {
      return {
        id: 'uuid',
        ...dto,
        isDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: 0,
      };
    }),
    getTodos: jest.fn(() => {
      return [
        {
          id: 'uuid',
          title: 'Test Todo',
          status: 'undone',
          priority: 5,
          category: 'General',
          dueDate: null,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }),
    updateTodo: jest.fn((id: string, dto: UpdateTodoDTO) => {
      return {
        id,
        title: dto.title || 'Test Todo',
        status: dto.isDone ? 'done' : 'undone',
      };
    }),
    deleteTodo: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTodos', () => {
    it('should return a list of todos', async () => {
      const filters: GetTodosFilterDTO = { status: 'undone' };
      const result = await controller.getTodos(filters);

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');

      expect(mockTodoService.getTodos).toHaveBeenCalledWith(filters);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const dto: CreateTodoDTO = { title: 'New Task', priority: 5 };
      const result = await controller.createTodo(dto);

      expect(result.id).toEqual(expect.any(String));

      expect(result).toEqual(
        expect.objectContaining({
          title: 'New Task',
          isDone: false,
        }),
      );
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const dto: UpdateTodoDTO = { isDone: true };
      const id = 'uuid';
      const result = await controller.updateTodo(id, dto);

      expect(result).toEqual(
        expect.objectContaining({
          id,
          status: 'done',
        }),
      );
      expect(mockTodoService.updateTodo).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const id = 'uuid';
      await controller.deleteTodo(id);

      expect(mockTodoService.deleteTodo).toHaveBeenCalledWith(id);
    });
  });
});
