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
import { Category } from '@/features/todos/api/todosApi';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface EditTodoFormUIProps {
	title: string;
	setTitle: (value: string) => void;
	priority: string;
	setPriority: (value: string) => void;
	category: string;
	handleCategoryChange: (value: string) => void;
	dueDate: string;
	setDueDate: (value: string) => void;
	categories: Category[];
	isLoading: boolean;
	handleSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
}

export const EditTodoFormUI: React.FC<EditTodoFormUIProps> = ({
	title,
	setTitle,
	priority,
	setPriority,
	category,
	handleCategoryChange,
	dueDate,
	setDueDate,
	categories,
	isLoading,
	handleSubmit,
	onCancel,
}) => {
	return (
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
	);
};
