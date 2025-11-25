import { Prisma, Todo } from '@prisma/client';
import { prismaService } from '../config/prisma.service';

export class TodoRepository {
	async create(data: Prisma.TodoCreateInput): Promise<Todo> {
		return prismaService.todo.create({ data });
	}

	async findAll(
		where: Prisma.TodoWhereInput,
		orderBy: Prisma.TodoOrderByWithRelationInput
	): Promise<Todo[]> {
		return prismaService.todo.findMany({
			where,
			orderBy,
		});
	}

	async findById(id: string): Promise<Todo | null> {
		return prismaService.todo.findUnique({ where: { id } });
	}

	async update(id: string, data: Prisma.TodoUpdateInput): Promise<Todo> {
		return prismaService.todo.update({
			where: { id },
			data,
		});
	}

	async delete(id: string): Promise<void> {
		await prismaService.todo.delete({ where: { id } });
	}
}
