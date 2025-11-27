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

export const AddTodoForm = () => {
	const { toast } = useToast();
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState('5');
	const [category, setCategory] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	const [createTodo, { isLoading }] = useCreateTodoMutation();
	const { data: categories = [] } = useGetCategoriesQuery();

	if (!category && categories.length > 0) {
		setCategory(categories[0].name);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;

		try {
			await createTodo({
				title,
				priority: Number(priority),
				category: category || 'General',
				dueDate: dueDate ? new Date(dueDate).toISOString() : null,
			}).unwrap();

			toast({
				title: 'Task Added',
				description: `"${title}" has been added successfully.`,
			} as ToastInput);

			setTitle('');
			setPriority('5');
			setDueDate('');
		} catch (err) {
			console.error('Failed to add todo', err);

			toast({
				variant: 'destructive',
				title: 'Error creating task',
				description: 'Failed to add the task. Please try again.',
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
				category={category}
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
