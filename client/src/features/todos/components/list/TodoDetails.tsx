import { Todo } from '@/features/todos/api/todosApi';
import { getPriorityColor } from '@/lib/constants';
import { Calendar, Clock, Tag } from 'lucide-react';
import React from 'react';

interface TodoDetailsProps {
	todo: Todo;
}

export const TodoDetails: React.FC<TodoDetailsProps> = ({ todo }) => {
	const priorityColor = getPriorityColor(todo.priority);

	const isOverdue =
		!todo.isDone &&
		todo.dueDate &&
		new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

	const formattedDueDate = todo.dueDate
		? new Date(todo.dueDate).toLocaleDateString('en-US', {
				day: 'numeric',
				month: 'short',
		  })
		: null;

	const formattedCreatedAt = new Date(todo.createdAt).toLocaleDateString(
		'en-US',
		{
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
		}
	);

	return (
		<div className='flex-1 min-w-0'>
			<div className='flex justify-between items-start mb-1'>
				<h3
					className={`font-medium truncate pr-2 ${
						todo.isDone
							? 'line-through text-muted-foreground'
							: isOverdue
							? 'text-destructive'
							: 'text-card-foreground'
					}`}
				>
					{todo.title}
				</h3>
				<span className='text-[10px] text-muted-foreground/60 flex items-center gap-1 shrink-0 mt-1'>
					<Clock size={10} />
					{formattedCreatedAt}
				</span>
			</div>
			<div className='flex items-center flex-wrap gap-2 text-xs'>
				<span
					className={`px-2 py-0.5 rounded-full font-medium border ${priorityColor}`}
				>
					Priority {todo.priority}
				</span>
				<span className='flex items-center gap-1 text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border'>
					<Tag size={10} />
					{todo.category}
				</span>
				{formattedDueDate && (
					<span
						className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${
							isOverdue
								? 'text-destructive bg-destructive/10 border-destructive/20'
								: 'text-muted-foreground bg-background border-border'
						}`}
					>
						<Calendar size={10} />
						{formattedDueDate}
					</span>
				)}
			</div>
		</div>
	);
};
