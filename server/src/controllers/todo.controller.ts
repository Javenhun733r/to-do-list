import { NextFunction, Request, Response } from 'express';
import {
	CreateTodoDTO,
	GetTodosFilterDTO,
	UpdateTodoDTO,
} from '../dtos/todo.dto';
import { TodoMapper } from '../mappers/todo.mapper';
import { TodoService } from '../services/todo.service';

const service = new TodoService();

export class TodoController {
	async getTodos(req: Request, res: Response, next: NextFunction) {
		try {
			const filters = req.query as unknown as GetTodosFilterDTO;
			const todos = await service.getTodos(filters);
			res.json(TodoMapper.toDTOList(todos));
		} catch (error) {
			next(error);
		}
	}

	async createTodo(req: Request, res: Response, next: NextFunction) {
		try {
			const body: CreateTodoDTO = req.body;
			const todo = await service.createTodo(body);
			res.status(201).json(TodoMapper.toDTO(todo));
		} catch (error) {
			next(error);
		}
	}

	async updateTodo(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const body: UpdateTodoDTO = req.body;

			const todo = await service.updateTodo(id, body);
			res.json(TodoMapper.toDTO(todo));
		} catch (error) {
			next(error);
		}
	}

	async deleteTodo(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await service.deleteTodo(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}
