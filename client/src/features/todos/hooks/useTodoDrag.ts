import { Todo, useUpdateTodoMutation } from '@/features/todos/api/todosApi';
import {
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';

export const useTodoDrag = (todos: Todo[]) => {
	const [items, setItems] = useState<Todo[]>([]);
	const [updateTodo, { isLoading: isMutatingOrder }] = useUpdateTodoMutation();

	useEffect(() => {
		setItems(todos);
	}, [todos]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) return;

		const oldIndex = items.findIndex(t => t.id === active.id);
		const newIndex = items.findIndex(t => t.id === over.id);

		const newOrderList = arrayMove(items, oldIndex, newIndex);

		setItems(newOrderList);

		const prevItem = newOrderList[newIndex - 1];
		const nextItem = newOrderList[newIndex + 1];

		let newOrderValue: number;

		if (!prevItem && !nextItem) {
			newOrderValue = Date.now();
		} else if (!prevItem) {
			newOrderValue = nextItem.order + 1000;
		} else if (!nextItem) {
			newOrderValue = prevItem.order - 1000;
		} else {
			newOrderValue = (prevItem.order + nextItem.order) / 2;
		}

		updateTodo({
			id: active.id as string,
			order: newOrderValue,
		});
	};

	return {
		items,
		sensors,
		handleDragEnd,
		isMutatingOrder,
	};
};
