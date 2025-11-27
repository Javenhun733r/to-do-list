import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Category } from '@/features/todos/api/todosApi';
import { Loader2, Plus } from 'lucide-react';
import React from 'react';

interface AddTodoFormUIProps {
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
}

export const AddTodoFormUI: React.FC<AddTodoFormUIProps> = ({
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
}) => {
	return (
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
	);
};
