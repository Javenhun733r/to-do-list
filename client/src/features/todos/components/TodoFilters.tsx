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
import { useGetCategoriesQuery } from '@/features/todos/api/todosApi';
import { useAppSelector } from '@/lib/store';
import { ArrowDownAZ, ArrowUpAZ, Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const TodoFilters = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { data: categories = [] } = useGetCategoriesQuery();

	const { status, sortBy, sortOrder, category } = useAppSelector(
		state => state.filters
	);

	const updateUrl = (key: string, value: string | undefined) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value === 'all' || value === undefined) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
		router.push(`${pathname}?${params.toString()}`);
	};

	const handleStatusChange = (val: string) => {
		updateUrl('status', val);
	};

	const handleCategoryChange = (val: string) => {
		updateUrl('category', val);
	};

	const handleSortByChange = (val: string) => {
		updateUrl('sortBy', val);
	};

	const handleSortOrderToggle = () => {
		const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		updateUrl('sortOrder', newOrder);
	};

	const resetFilters = () => {
		router.push(pathname);
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
							<Select value={status} onValueChange={handleStatusChange}>
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
								onValueChange={handleCategoryChange}
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
								<Select value={sortBy} onValueChange={handleSortByChange}>
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
									onClick={handleSortOrderToggle}
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
