import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
	Todo,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from '@/features/todos/api/todosApi';
import {
	CheckCircle,
	Circle,
	GripVertical,
	Loader2,
	Pencil,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { EditTodoDialog } from '../dialogs/EditTodoDialog';
import { TodoDetails } from './TodoDetails';

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

	const isLoading = isUpdating || isDeleting;

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
				<TodoDetails todo={todo} />

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
