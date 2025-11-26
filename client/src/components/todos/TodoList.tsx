import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Inbox, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { TodoItem } from './TodoItem';

import {
	Todo,
	useGetTodosQuery,
	useUpdateTodoMutation,
} from '@/lib/features/api/todosApi';

import { useAppSelector } from '@/lib/store';

export const TodoList: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);

	const filters = useAppSelector(state => state.filters);

	const {
		data: todos = [],
		isLoading,
		isError,
	} = useGetTodosQuery({
		status: filters.status,
		search: filters.search,
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
		category: filters.category,
	});

	const [updateTodo] = useUpdateTodoMutation();
	const [items, setItems] = useState<Todo[]>([]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

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

	const isDragEnabled =
		filters.sortBy === 'order' && !filters.search && filters.status === 'all';

	const itemIds = useMemo(() => items.map(t => t.id), [items]);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id && over) {
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
		}
	};

	if (!isMounted) {
		return (
			<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
				<Loader2 className='animate-spin w-10 h-10 mb-4 text-blue-500' />
				<p>Initializing...</p>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
				<Loader2 className='animate-spin w-10 h-10 mb-4 text-blue-500' />
				<p>Loading your tasks...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className='p-10 text-center text-red-500'>
				Error loading tasks. Is the server running?
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-20 text-gray-400'>
				<Inbox size={32} className='text-gray-300 mb-4' />
				<p>No tasks found</p>
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={itemIds}
				strategy={verticalListSortingStrategy}
				disabled={!isDragEnabled}
			>
				<div className='divide-y divide-gray-100 dark:divide-gray-800'>
					{items.map(todo => (
						<TodoItem key={todo.id} todo={todo} isDraggable={isDragEnabled} />
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
};
