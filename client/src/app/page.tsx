'use client';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { AddTodoForm } from '@/features/todos/components/forms/AddTodoForm';
import { TodoList } from '@/features/todos/components/list/TodoList';
import { SearchInput } from '@/features/todos/components/SearchInput';
import { TodoFilters } from '@/features/todos/components/TodoFilters';
import { UrlSynchronizer } from '@/features/todos/components/UrlSynchronizer';

export default function Home() {
	return (
		<main className='min-h-screen bg-background py-12 px-4 font-sans text-foreground transition-colors duration-300'>
			{}
			<UrlSynchronizer />

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
							{}
							<SearchInput />

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
