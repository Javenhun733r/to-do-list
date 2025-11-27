'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Input } from '@/components/ui/input';
import type { GetTodosParams } from '@/features/todos/api/todosApi';
import { AddTodoForm } from '@/features/todos/components/forms/AddTodoForm';
import { TodoList } from '@/features/todos/components/list/TodoList';
import { TodoFilters } from '@/features/todos/components/TodoFilters';
import {
	setFilterCategory,
	setFilterStatus,
	setSearchQuery,
	setSort,
} from '@/features/todos/model/filterSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch } from '@/lib/store';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEFAULT_FILTERS = {
	status: 'all',
	sortBy: 'order',
	sortOrder: 'desc',
	category: 'all',
	search: '',
};

export default function Home() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentUrlSearch = searchParams.get('search') || '';

	const [inputValue, setInputValue] = useState(currentUrlSearch);

	const debouncedSearch = useDebounce(inputValue, 500);

	useEffect(() => {
		const currentStatus = searchParams.get('status') || DEFAULT_FILTERS.status;
		const currentCategory =
			searchParams.get('category') || DEFAULT_FILTERS.category;
		const currentSortBy = searchParams.get('sortBy') || DEFAULT_FILTERS.sortBy;
		const currentSortOrder =
			searchParams.get('sortOrder') || DEFAULT_FILTERS.sortOrder;

		dispatch(setFilterStatus(currentStatus as GetTodosParams['status']));
		dispatch(setFilterCategory(currentCategory));
		dispatch(
			setSort({
				sortBy: currentSortBy as GetTodosParams['sortBy'],
				sortOrder: currentSortOrder as GetTodosParams['sortOrder'],
			})
		);
		dispatch(setSearchQuery(currentUrlSearch));
	}, [searchParams, dispatch, currentUrlSearch]);

	useEffect(() => {
		setInputValue(currentUrlSearch);
	}, [currentUrlSearch]);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (debouncedSearch) {
			params.set('search', debouncedSearch);
		} else {
			params.delete('search');
		}

		if (params.toString() !== searchParams.toString()) {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		}
	}, [debouncedSearch, pathname, router, searchParams]);

	return (
		<main className='min-h-screen bg-background py-12 px-4 font-sans text-foreground transition-colors duration-300'>
			<div className='max-w-4xl mx-auto space-y-8'>
				<header className='flex justify-between items-center'>
					<div className='text-center space-y-2 flex-1'>
						<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl'>
							Task<span className='text-blue-600'>Master</span>
						</h1>
						<p className='text-muted-foreground max-w-2xl mx-auto'>
							Professional task management.
						</p>
					</div>
					<div className='absolute top-6 right-6 md:static md:ml-4'>
						<ThemeToggle />
					</div>
				</header>

				<div className='bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-colors duration-300'>
					<div className='p-6 border-b border-border bg-card space-y-4'>
						<div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
							<div className='relative w-full md:flex-1'>
								<Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search tasks...'
									value={inputValue}
									onChange={e => setInputValue(e.target.value)}
									className='pl-9 bg-background'
								/>
							</div>

							<TodoFilters />
						</div>

						<div className='pt-2'>
							<AddTodoForm />
						</div>
					</div>

					<div className='bg-muted/50 min-h-[400px]'>
						<TodoList />
					</div>
				</div>
			</div>
		</main>
	);
}
