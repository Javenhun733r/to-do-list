import { Todo } from '@prisma/client';
import { TodoResponseDTO } from '../dtos/todo.dto';

export class TodoMapper {
	static toDTO(entity: Todo): TodoResponseDTO {
		return {
			id: entity.id,
			title: entity.title,
			status: entity.isDone ? 'done' : 'undone',
			priority: entity.priority,
			dueDate: entity.dueDate ? entity.dueDate.toISOString() : null,
			category: entity.category || 'General',
			order: entity.order,
			createdAt: entity.createdAt.toISOString(),
			updatedAt: entity.updatedAt.toISOString(),
		};
	}

	static toDTOList(entities: Todo[]): TodoResponseDTO[] {
		return entities.map(entity => TodoMapper.toDTO(entity));
	}
}
