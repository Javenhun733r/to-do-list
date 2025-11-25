export interface TodoEntity {
	id: string;
	title: string;
	isDone: boolean;
	priority: number;
	dueDate: Date | null;
	category: string | null;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}
