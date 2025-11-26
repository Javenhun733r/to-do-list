import {
	Todo,
	useDeleteTodoMutation,
	useUpdateTodoMutation,
} from '@/lib/features/todos/todoSlice';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle, Circle, GripVertical, Tag, Trash2 } from 'lucide-react';

interface TodoItemProps {
	todo: Todo;
	isDraggable?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
	todo,
	isDraggable = false,
}) => {
	const [updateTodo] = useUpdateTodoMutation();
	const [deleteTodo] = useDeleteTodoMutation();

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: todo.id, disabled: !isDraggable });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 10 : 1,
		opacity: isDragging ? 0.5 : 1,
	};

	const toggleStatus = () => {
		const newStatus = todo.isDone === 'done' ? false : true;
		updateTodo({ id: todo.id, patch: { isDone: newStatus } });
	};

	const priorityColor =
		todo.priority >= 8
			? 'text-red-600 bg-red-50'
			: todo.priority >= 5
			? 'text-yellow-600 bg-yellow-50'
			: 'text-blue-600 bg-blue-50';

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group ${
				isDragging ? 'border-blue-500 shadow-xl' : ''
			}`}
		>
			{isDraggable && (
				<div
					{...attributes}
					{...listeners}
					className='cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-1'
				>
					<GripVertical size={20} />
				</div>
			)}

			<button
				onClick={toggleStatus}
				className='shrink-0 text-gray-400 hover:text-blue-600 transition'
			>
				{todo.isDone === 'done' ? (
					<CheckCircle className='text-green-500 w-6 h-6' />
				) : (
					<Circle className='w-6 h-6' />
				)}
			</button>

			<div className='flex-1 min-w-0'>
				<h3
					className={`font-medium truncate ${
						todo.isDone === 'done'
							? 'line-through text-gray-400'
							: 'text-gray-800'
					}`}
				>
					{todo.title}
				</h3>
				<div className='flex items-center gap-3 mt-1 text-xs'>
					<span
						className={`px-2 py-0.5 rounded-full font-medium ${priorityColor}`}
					>
						Priority {todo.priority}
					</span>
					<span className='flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
						<Tag size={10} />
						{todo.category}
					</span>
				</div>
			</div>

			<button
				onClick={() => deleteTodo(todo.id)}
				className='text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2'
			>
				<Trash2 size={18} />
			</button>
		</div>
	);
};
