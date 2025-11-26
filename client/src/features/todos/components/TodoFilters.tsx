'use client';

import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
	GetTodosParams,
	useGetCategoriesQuery,
} from '@/features/todos/api/todosApi';
import {
	setFilterCategory,
	setFilterStatus,
	setSort,
} from '@/features/todos/model/filterSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { ArrowDownAZ, ArrowUpAZ, Filter } from 'lucide-react';

export const TodoFilters = () => {
	const dispatch = useAppDispatch();
	const { data: categories = [] } = useGetCategoriesQuery();

	const { status, sortBy, sortOrder, category } = useAppSelector(
		state => state.filters
	);

	const resetFilters = () => {
		dispatch(setFilterStatus('all'));
		dispatch(setFilterCategory('all'));
		dispatch(setSort({ sortBy: 'createdAt', sortOrder: 'desc' }));
	};

	const activeFiltersCount = [
		status !== 'all',
		category !== 'all',
		sortBy !== 'order',
	].filter(Boolean).length;

	return (
		<div className='flex items-center gap-2'>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant='outline' className='h-10 gap-2 border-dashed'>
						<Filter className='h-4 w-4' />
						Filters
						{activeFiltersCount > 0 && (
							<>
								<Separator orientation='vertical' className='mx-2 h-4' />
								<span className='text-xs font-medium bg-secondary px-1.5 py-0.5 rounded-sm'>
									{activeFiltersCount}
								</span>
							</>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-80 p-4 bg-card border-border' align='end'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<h4 className='font-medium leading-none text-foreground'>
								Filter Tasks
							</h4>
							<Button
								variant='ghost'
								size='sm'
								className='h-auto p-0 text-muted-foreground hover:text-foreground'
								onClick={resetFilters}
							>
								Reset
							</Button>
						</div>

						<Separator className='bg-border' />

						<div className='space-y-2'>
							<label className='text-xs font-medium text-muted-foreground'>
								Status
							</label>
							<Select
								value={status}
								onValueChange={(val: string) =>
									dispatch(setFilterStatus(val as GetTodosParams['status']))
								}
							>
								<SelectTrigger className='w-full bg-background'>
									<SelectValue placeholder='Select status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Statuses</SelectItem>
									<SelectItem value='done'>Completed</SelectItem>
									<SelectItem value='undone'>To Do</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<label className='text-xs font-medium text-muted-foreground'>
								Category
							</label>
							<Select
								value={category || 'all'}
								onValueChange={(val: string) =>
									dispatch(setFilterCategory(val))
								}
							>
								<SelectTrigger className='w-full bg-background'>
									<SelectValue placeholder='Select category' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Categories</SelectItem>
									{categories.map(cat => (
										<SelectItem key={cat.id} value={cat.name}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='space-y-2'>
							<label className='text-xs font-medium text-muted-foreground'>
								Sorting
							</label>
							<div className='flex gap-2'>
								<Select
									value={sortBy}
									onValueChange={(val: string) =>
										dispatch(
											setSort({
												sortBy: val as GetTodosParams['sortBy'],
												sortOrder,
											})
										)
									}
								>
									<SelectTrigger className='flex-1 bg-background'>
										<SelectValue placeholder='Sort by' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='order'>Manual (Drag)</SelectItem>
										<SelectItem value='priority'>Priority</SelectItem>
										<SelectItem value='dueDate'>Due Date</SelectItem>
										<SelectItem value='createdAt'>Created Date</SelectItem>
									</SelectContent>
								</Select>

								<Button
									variant='outline'
									size='icon'
									className='shrink-0'
									onClick={() =>
										dispatch(
											setSort({
												sortBy,
												sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
											})
										)
									}
								>
									{sortOrder === 'asc' ? (
										<ArrowUpAZ className='h-4 w-4' />
									) : (
										<ArrowDownAZ className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
