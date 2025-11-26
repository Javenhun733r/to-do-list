'use client';

import { AddTodoForm } from '@/components/todos/AddTodoForm';
import { TodoList } from '@/components/todos/TodoList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown, Search } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
	const [filter, setFilter] = useState('all');
	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState('order');
	const [sortOrder, setSortOrder] = useState('desc');

	return (
		<main className='min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900'>
			<div className='max-w-4xl mx-auto space-y-8'>
				<header className='text-center space-y-2'>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl'>
						Task<span className='text-blue-600'>Master</span>
					</h1>
					<p className='text-muted-foreground max-w-2xl mx-auto'>
						Professional task management. Built with Next.js, NestJS & Tailwind.
					</p>
				</header>

				<div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
					<div className='p-6 border-b border-slate-100 bg-white space-y-4'>
						<div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
							<div className='relative w-full md:w-96'>
								<Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search tasks...'
									value={search}
									onChange={e => setSearch(e.target.value)}
									className='pl-9'
								/>
							</div>

							<div className='flex flex-wrap gap-2 w-full md:w-auto'>
								<Select value={filter} onValueChange={setFilter}>
									<SelectTrigger className='w-[140px]'>
										<SelectValue placeholder='Status' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>All Statuses</SelectItem>
										<SelectItem value='done'>Completed</SelectItem>
										<SelectItem value='undone'>To Do</SelectItem>
									</SelectContent>
								</Select>

								<Select value={sortBy} onValueChange={setSortBy}>
									<SelectTrigger className='w-[180px]'>
										<SelectValue placeholder='Sort by' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='order'>Manual (Drag & Drop)</SelectItem>
										<SelectItem value='priority'>Priority</SelectItem>
										<SelectItem value='dueDate'>Due Date</SelectItem>
										<SelectItem value='createdAt'>Created Date</SelectItem>
									</SelectContent>
								</Select>

								<Button
									variant='outline'
									size='icon'
									onClick={() =>
										setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
									}
								>
									<ArrowUpDown className='h-4 w-4' />
								</Button>
							</div>
						</div>

						<div className='pt-2'>
							<AddTodoForm />
						</div>
					</div>

					<div className='bg-slate-50/50 min-h-[400px]'>
						<TodoList
							filter={filter}
							search={search}
							sortBy={sortBy}
							sortOrder={sortOrder}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
