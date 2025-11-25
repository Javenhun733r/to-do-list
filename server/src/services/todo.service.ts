import { TodoEntity } from '../models/todo.model';
import {
	CreateTodoDTO,
	GetTodosFilterDTO,
	UpdateTodoDTO,
} from '../dtos/todo.dto';
import { TodoRepository } from '../repositories/todo.repository';

export class TodoService {
	private repo: TodoRepository;

	constructor() {
		this.repo = new TodoRepository();
	}

	async createTodo(data: CreateTodoDTO): Promise<TodoEntity> {
		const priority = Math.min(Math.max(data.priority || 5, 1), 10);
		const order = Date.now();
		return this.repo.create({
			title: data.title,
			priority,
			dueDate: data.dueDate ? new Date(data.dueDate) : null,
			category: data.category || 'General',
			order,
			isDone: false,
		});
	}

	async getTodos(filters: GetTodosFilterDTO): Promise<TodoEntity[]> {
		const where: any = {};

		if (filters.status === 'done') where.isDone = true;
		if (filters.status === 'undone') where.isDone = false;
		if (filters.search) {
			where.title = { contains: filters.search, mode: 'insensitive' };
		}
		const orderBy: any = {};
		const sortField = filters.sortBy || 'createdAt';
		const sortOrder = filters.sortOrder || 'desc';
		orderBy[sortField] = sortOrder;

		return this.repo.findAll(where, orderBy);
	}

	async updateTodo(id: string, data: UpdateTodoDTO): Promise<TodoEntity> {
		const updateData: any = { ...data };

		if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
		if (data.dueDate === null) updateData.dueDate = null;

		if (data.priority !== undefined) {
			updateData.priority = Math.min(Math.max(data.priority, 1), 10);
		}

		return this.repo.update(id, updateData);
	}

	async deleteTodo(id: string): Promise<void> {
		await this.repo.delete(id);
	}
}
