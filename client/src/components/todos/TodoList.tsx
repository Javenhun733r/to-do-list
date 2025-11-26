import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Inbox } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { TodoSkeleton } from '../TodoSkeleton';
import { TodoItem } from './TodoItem';

import { useTodoDrag } from '@/hooks/useTodoDrag';
import { useGetTodosQuery } from '@/lib/features/api/todosApi';
import { useAppSelector } from '@/lib/store';

export const TodoList: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);
	const filters = useAppSelector(state => state.filters);

	const {
		data: todos = [],
		isLoading,
		isError,
		isFetching,
	} = useGetTodosQuery({
		status: filters.status,
		search: filters.search,
		sortBy: filters.sortBy,
		sortOrder: filters.sortOrder,
		category: filters.category,
	});

	const { items, sensors, handleDragEnd } = useTodoDrag(todos);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsMounted(true);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	const isDragEnabled =
		filters.sortBy === 'order' && !filters.search && filters.status === 'all';

	const itemIds = useMemo(() => items.map(t => t.id), [items]);

	if (!isMounted || isLoading) {
		return (
			<div className='space-y-3'>
				{[...Array(5)].map((_, i) => (
					<TodoSkeleton key={i} />
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className='p-10 text-center text-destructive bg-destructive/10 rounded-lg border border-destructive/20'>
				<p>Error loading tasks.</p>
				<p className='text-sm opacity-80'>
					Please check if the backend is running.
				</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center py-20 text-muted-foreground'>
				<Inbox size={32} className='mb-4 opacity-50' />
				<p>No tasks found</p>
			</div>
		);
	}

	return (
		<div className={isFetching ? 'opacity-70 transition-opacity' : ''}>
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
					<div className='divide-y divide-border space-y-3'>
						{items.map(todo => (
							<TodoItem key={todo.id} todo={todo} isDraggable={isDragEnabled} />
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};
