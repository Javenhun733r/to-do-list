import { NextFunction, Request, Response } from 'express';
import { CreateTodoDTO, UpdateTodoDTO } from '../dtos/todo.dto';

export class ValidationMiddleware {
	static validateCreateTodo(req: Request, res: Response, next: NextFunction) {
		const body: CreateTodoDTO = req.body;

		if (
			!body.title ||
			typeof body.title !== 'string' ||
			body.title.trim().length === 0
		) {
			res.status(400).json({
				status: 'error',
				message: 'Title is required and must be a non-empty string',
			});
			return;
		}

		if (body.priority !== undefined) {
			const priority = Number(body.priority);
			if (isNaN(priority) || priority < 1 || priority > 10) {
				res.status(400).json({
					status: 'error',
					message: 'Priority must be a number between 1 and 10',
				});
				return;
			}
		}

		next();
	}

	static validateUpdateTodo(req: Request, res: Response, next: NextFunction) {
		const body: UpdateTodoDTO = req.body;

		if (body.priority !== undefined) {
			const priority = Number(body.priority);
			if (isNaN(priority) || priority < 1 || priority > 10) {
				res.status(400).json({
					status: 'error',
					message: 'Priority must be a number between 1 and 10',
				});
				return;
			}
		}

		next();
	}
}
