import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	useCreateCategoryMutation,
	useCreateTodoMutation,
	useGetCategoriesQuery,
} from '@/lib/features/todos/todoSlice';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';

export const AddTodoForm = () => {
	const [title, setTitle] = useState('');
	const [priority, setPriority] = useState('5');
	const [category, setCategory] = useState('');

	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');

	const [createTodo, { isLoading }] = useCreateTodoMutation();
	const { data: categories = [] } = useGetCategoriesQuery();
	const [createCategory, { isLoading: isCreatingCat }] =
		useCreateCategoryMutation();

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
			}).unwrap();
			setTitle('');
			setPriority('5');
		} catch (err) {
			console.error('Failed to add todo', err);
		}
	};

	const handleCreateCategory = async () => {
		if (!newCategoryName.trim()) return;
		try {
			await createCategory({ name: newCategoryName }).unwrap();
			setCategory(newCategoryName);
			setIsCategoryModalOpen(false);
			setNewCategoryName('');
		} catch (err) {
			console.error('Failed to create category', err);
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
				className='flex flex-col sm:flex-row gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200'
			>
				<Input
					placeholder='What needs to be done?'
					value={title}
					onChange={e => setTitle(e.target.value)}
					className='flex-1 bg-white'
				/>

				<div className='flex gap-2'>
					{}
					<Select value={priority} onValueChange={setPriority}>
						<SelectTrigger className='w-[110px] bg-white'>
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

					{}
					<Select value={category} onValueChange={handleCategoryChange}>
						<SelectTrigger className='w-[140px] bg-white'>
							<SelectValue placeholder='Category' />
						</SelectTrigger>
						<SelectContent>
							{categories.map(cat => (
								<SelectItem key={cat.id} value={cat.name}>
									{cat.name}
								</SelectItem>
							))}
							{}
							<SelectItem
								value='CREATE_NEW_CATEGORY_ACTION'
								className='text-blue-600 font-medium cursor-pointer border-t mt-1 pt-1'
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

			{}
			<Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Category</DialogTitle>
					</DialogHeader>
					<div className='py-4'>
						<Input
							placeholder='Category Name (e.g. Fitness)'
							value={newCategoryName}
							onChange={e => setNewCategoryName(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
						/>
					</div>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setIsCategoryModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateCategory}
							disabled={isCreatingCat || !newCategoryName.trim()}
						>
							{isCreatingCat ? 'Creating...' : 'Create'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
