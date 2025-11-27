import {
	Todo,
	useGetCategoriesQuery,
	useUpdateTodoMutation,
} from '@/features/todos/api/todosApi';

import { useToast, type ToastProps } from '@/hooks/useToast';
import { useState } from 'react';
import { CreateCategoryDialog } from '../dialogs/CreateCategoryDialog';
import { EditTodoFormUI } from './EditTodoFormUI';

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

interface EditTodoFormProps {
	todo: Todo;
	onSuccess: () => void;
	onCancel: () => void;
}

const formatDateForInput = (dateString?: string | null) => {
	if (!dateString) return '';
	return new Date(dateString).toISOString().split('T')[0];
};

export const EditTodoForm = ({
	todo,
	onSuccess,
	onCancel,
}: EditTodoFormProps) => {
	const { toast } = useToast();

	const [title, setTitle] = useState(todo.title);
	const [priority, setPriority] = useState(todo.priority.toString());
	const [category, setCategory] = useState(todo.category);
	const [dueDate, setDueDate] = useState(formatDateForInput(todo.dueDate));
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	const [updateTodo, { isLoading }] = useUpdateTodoMutation();
	const { data: categories = [] } = useGetCategoriesQuery();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		try {
			await updateTodo({
				id: todo.id,
				title,
				priority: Number(priority),
				category: category || 'General',
				dueDate: dueDate ? new Date(dueDate).toISOString() : null,
			}).unwrap();

			toast({
				title: 'Task updated',
				description: 'Your changes have been saved successfully.',
			} as ToastInput);

			onSuccess();
		} catch (error: unknown) {
			const err = error as ApiError;
			console.error('Failed to update todo', err);

			let errorMessage = 'Failed to update the task. Please try again.';
			if (err?.data?.message) {
				errorMessage = Array.isArray(err.data.message)
					? err.data.message[0]
					: err.data.message;
			}

			toast({
				variant: 'destructive',
				title: 'Error',
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
			<EditTodoFormUI
				title={title}
				setTitle={setTitle}
				priority={priority}
				setPriority={setPriority}
				category={category}
				handleCategoryChange={handleCategoryChange}
				dueDate={dueDate}
				setDueDate={setDueDate}
				categories={categories}
				isLoading={isLoading}
				handleSubmit={handleSubmit}
				onCancel={onCancel}
			/>

			<CreateCategoryDialog
				open={isCategoryModalOpen}
				onOpenChange={setIsCategoryModalOpen}
				onCategoryCreated={setCategory}
			/>
		</>
	);
};
