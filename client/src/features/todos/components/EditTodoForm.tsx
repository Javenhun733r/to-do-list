import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import {
	Todo,
	useGetCategoriesQuery,
	useUpdateTodoMutation,
} from '@/features/todos/api/todosApi';

import { useToast, type ToastProps } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { CreateCategoryDialog } from './CreateCategoryDialog';

interface ToastInput extends ToastProps {
	title: string;
	description: string;
	variant?: 'default' | 'destructive';
}

interface EditTodoFormProps {
	todo: Todo;
	onSuccess: () => void;
	onCancel: () => void;
}

export const EditTodoForm = ({
	todo,
	onSuccess,
	onCancel,
}: EditTodoFormProps) => {
	const { toast } = useToast();
	const [title, setTitle] = useState(todo.title);
	const [priority, setPriority] = useState(todo.priority.toString());
	const [category, setCategory] = useState(todo.category);

	const formatDateForInput = (dateString?: string | null) => {
		if (!dateString) return '';
		return new Date(dateString).toISOString().split('T')[0];
	};

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
		} catch (err) {
			console.error('Failed to update todo', err);

			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to update the task. Please try again.',
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
			<form onSubmit={handleSubmit} className='space-y-4 py-4'>
				<div className='space-y-2'>
					<label className='text-sm font-medium'>Title</label>
					<Input
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='Task title'
						className='bg-background'
					/>
				</div>

				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Priority</label>
						<Select value={priority} onValueChange={setPriority}>
							<SelectTrigger className='bg-background'>
								<SelectValue placeholder='Priority' />
							</SelectTrigger>
							<SelectContent>
								{[...Array(10)].map((_, i) => (
									<SelectItem key={i + 1} value={(i + 1).toString()}>
										{i + 1}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<label className='text-sm font-medium'>Category</label>
						<Select value={category} onValueChange={handleCategoryChange}>
							<SelectTrigger className='bg-background'>
								<SelectValue placeholder='Category' />
							</SelectTrigger>
							<SelectContent>
								{categories.map(cat => (
									<SelectItem key={cat.id} value={cat.name}>
										{cat.name}
									</SelectItem>
								))}
								<SelectItem
									value='CREATE_NEW_CATEGORY_ACTION'
									className='text-blue-600 font-medium cursor-pointer border-t mt-1 pt-1 dark:text-blue-400 dark:border-border'
								>
									+ Create New...
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='space-y-2'>
					<label className='text-sm font-medium'>Due Date</label>
					<Input
						type='date'
						value={dueDate}
						onChange={e => setDueDate(e.target.value)}
						className='bg-background'
					/>
				</div>

				<DialogFooter>
					<Button type='button' variant='outline' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit' disabled={isLoading || !title.trim()}>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Save Changes
					</Button>
				</DialogFooter>
			</form>

			<CreateCategoryDialog
				open={isCategoryModalOpen}
				onOpenChange={setIsCategoryModalOpen}
				onCategoryCreated={setCategory}
			/>
		</>
	);
};
