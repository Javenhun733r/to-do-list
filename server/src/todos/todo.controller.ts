import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateTodoDTO,
  GetTodosFilterDTO,
  TodoResponseDTO,
  UpdateTodoDTO,
} from './dto/index';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Get()
  getTodos(@Query() filters: GetTodosFilterDTO): Promise<TodoResponseDTO[]> {
    return this.service.getTodos(filters);
  }

  @Post()
  createTodo(@Body() body: CreateTodoDTO): Promise<TodoResponseDTO> {
    return this.service.createTodo(body);
  }

  @Patch(':id')
  updateTodo(
    @Param('id') id: string,
    @Body() body: UpdateTodoDTO,
  ): Promise<TodoResponseDTO> {
    return this.service.updateTodo(id, body);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string): Promise<void> {
    return this.service.deleteTodo(id);
  }
}
