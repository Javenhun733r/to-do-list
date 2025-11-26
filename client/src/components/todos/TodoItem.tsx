import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
	Todo,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from '@/lib/features/api/todosApi';
import {
	Calendar,
	CheckCircle,
	Circle,
	Clock,
	GripVertical,
	Loader2,
	Pencil,
	Tag,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { EditTodoDialog } from './EditTodoDialog';

interface TodoItemProps {
	todo: Todo;
	isDraggable?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
	todo,
	isDraggable = false,
}) => {
	const [isEditOpen, setIsEditOpen] = useState(false);

	const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
	const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: todo.id, disabled: !isDraggable });

	const style = {
		transform: CSS.Translate.toString(transform),

		transition,
		zIndex: isDragging ? 10 : 1,
		opacity: isDragging ? 0.5 : 1,
		position: 'relative' as const,
	};

	const toggleStatus = () => {
		updateTodo({ id: todo.id, isDone: !todo.isDone });
	};

	const handleDelete = () => {
		deleteTodo(todo.id);
	};

	const priorityColor =
		todo.priority >= 8
			? 'text-destructive bg-destructive/10 border-destructive/20'
			: todo.priority >= 5
			? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400'
			: 'text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400';

	const isLoading = isUpdating || isDeleting;

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

	const isOverdue =
		!todo.isDone &&
		todo.dueDate &&
		new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

	return (
		<>
			<div
				ref={setNodeRef}
				style={style}
				className={`flex items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group touch-none ${
					isDragging ? 'border-primary shadow-xl ring-2 ring-primary/20' : ''
				} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
			>
				{isDraggable && (
					<div
						{...attributes}
						{...listeners}
						className='cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground p-1 shrink-0'
						aria-label='Drag to reorder'
					>
						<GripVertical size={20} />
					</div>
				)}

				<button
					onClick={toggleStatus}
					disabled={isLoading}
					aria-label={todo.isDone ? 'Mark as not done' : 'Mark as done'}
					className='shrink-0 text-muted-foreground hover:text-primary transition-colors'
				>
					{todo.isDone ? (
						<CheckCircle className='text-green-500 w-6 h-6' />
					) : (
						<Circle className='w-6 h-6' />
					)}
				</button>

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

				<button
					onClick={() => setIsEditOpen(true)}
					disabled={isLoading}
					aria-label='Edit task'
					className='text-muted-foreground/50 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity p-2 ml-auto'
				>
					<Pencil size={18} />
				</button>

				<button
					onClick={handleDelete}
					disabled={isLoading}
					aria-label='Delete task'
					className='text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-2'
				>
					{isDeleting ? (
						<Loader2 size={18} className='animate-spin text-destructive' />
					) : (
						<Trash2 size={18} />
					)}
				</button>
			</div>

			<EditTodoDialog
				todo={todo}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>
		</>
	);
};
