export interface CreateTodoDTO {
	title: string;
	priority?: number;
	dueDate?: string;
	category?: string;
}

export interface UpdateTodoDTO {
	title?: string;
	isDone?: boolean;
	priority?: number;
	dueDate?: string | null;
	category?: string;
	order?: number;
}

export interface GetTodosFilterDTO {
	status?: 'done' | 'undone' | 'all';
	search?: string;
	sortBy?: 'priority' | 'dueDate' | 'order' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export interface TodoResponseDTO {
	id: string;
	title: string;
	status: 'done' | 'undone';
	priority: number;
	dueDate: string | null;
	category: string;
	order: number;
	createdAt: string;
	updatedAt: string;
}
