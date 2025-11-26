import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Todo } from '@/features/todos/api/todosApi';
import { EditTodoForm } from './EditTodoForm';

interface EditTodoDialogProps {
	todo: Todo;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const EditTodoDialog = ({
	todo,
	open,
	onOpenChange,
}: EditTodoDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
				</DialogHeader>
				{open && (
					<EditTodoForm
						todo={todo}
						key={todo.id}
						onSuccess={() => onOpenChange(false)}
						onCancel={() => onOpenChange(false)}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
