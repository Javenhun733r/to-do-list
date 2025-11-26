import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	useCreateTodoMutation,
	useGetCategoriesQuery,
} from '@/features/todos/api/todosApi';

import { useToast, type ToastProps } from '@/hooks/useToast';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateCategoryDialog } from './CreateCategoryDialog';

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
			<form
				onSubmit={handleSubmit}
				className='flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-lg border border-border transition-colors duration-300'
			>
				<div className='flex-1 flex gap-2'>
					<Input
						placeholder='What needs to be done?'
						value={title}
						onChange={e => setTitle(e.target.value)}
						className='flex-1 bg-background'
					/>

					<div className='relative w-auto'>
						<Input
							type='date'
							value={dueDate}
							onChange={e => setDueDate(e.target.value)}
							className='bg-background w-[130px] px-2 text-sm'
						/>
					</div>
				</div>

				<div className='flex gap-2'>
					<Select value={priority} onValueChange={setPriority}>
						<SelectTrigger className='w-[110px] bg-background'>
							<SelectValue placeholder='Priority' />
						</SelectTrigger>
						<SelectContent>
							{[...Array(10)].map((_, i) => (
								<SelectItem key={i + 1} value={(i + 1).toString()}>
									Priority {i + 1}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select value={category} onValueChange={handleCategoryChange}>
						<SelectTrigger className='w-[140px] bg-background'>
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

					<Button type='submit' disabled={isLoading || !title.trim()}>
						{isLoading ? (
							<Loader2 className='animate-spin' />
						) : (
							<Plus className='mr-2 h-4 w-4' />
						)}
						Add
					</Button>
				</div>
			</form>
			<CreateCategoryDialog
				open={isCategoryModalOpen}
				onOpenChange={setIsCategoryModalOpen}
				onCategoryCreated={newCategory => setCategory(newCategory)}
			/>
		</>
	);
};
