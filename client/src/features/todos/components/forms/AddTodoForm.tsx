import {
	useCreateTodoMutation,
	useGetCategoriesQuery,
} from '@/features/todos/api/todosApi';
import { useToast, type ToastProps } from '@/hooks/useToast';
import { useState } from 'react';
import { CreateCategoryDialog } from '../dialogs/CreateCategoryDialog';
import { AddTodoFormUI } from './AddTodoFormUI';

interface ToastInput extends ToastProps {
	title: string;
	description: string;
	variant?: 'default' | 'destructive';
}

interface ApiError {
	status?: number;
	data?: {
		message?: string | string[];
	};
}

export const AddTodoForm = () => {
	const { toast } = useToast();
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState('5');
	const [category, setCategory] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	const [createTodo, { isLoading }] = useCreateTodoMutation();
	const { data: categories = [] } = useGetCategoriesQuery();

	const activeCategory = category || categories[0]?.name || '';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		try {
			await createTodo({
				title,
				priority: Number(priority),

				category: activeCategory || 'General',
				dueDate: dueDate ? new Date(dueDate).toISOString() : null,
			}).unwrap();

			toast({
				title: 'Task Added',
				description: `"${title}" has been added successfully.`,
			} as ToastInput);

			setTitle('');
			setPriority('5');
			setDueDate('');
		} catch (error: unknown) {
			const err = error as ApiError;
			console.error('Failed to add todo', err);

			let errorMessage = 'Failed to add the task. Please try again.';
			if (err?.data?.message) {
				errorMessage = Array.isArray(err.data.message)
					? err.data.message[0]
					: err.data.message;
			}

			toast({
				variant: 'destructive',
				title: 'Error creating task',
				description: errorMessage,
			} as ToastInput);
		}
	};

	const handleCategoryChange = (value: string) => {
		if (value === 'CREATE_NEW_CATEGORY_ACTION') {
			setIsCategoryModalOpen(true);
		} else {
			setCategory(value);
		}
	};

	return (
		<>
			<AddTodoFormUI
				title={title}
				setTitle={setTitle}
				priority={priority}
				setPriority={setPriority}
				category={activeCategory}
				handleCategoryChange={handleCategoryChange}
				dueDate={dueDate}
				setDueDate={setDueDate}
				categories={categories}
				isLoading={isLoading}
				handleSubmit={handleSubmit}
			/>
			<CreateCategoryDialog
				open={isCategoryModalOpen}
				onOpenChange={setIsCategoryModalOpen}
				onCategoryCreated={newCategory => setCategory(newCategory)}
			/>
		</>
	);
};
