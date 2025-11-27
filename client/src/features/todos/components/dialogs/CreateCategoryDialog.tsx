import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateCategoryMutation } from '@/features/todos/api/todosApi';
import { useState } from 'react';

import { useToast, type ToastProps } from '@/hooks/useToast';
import { Loader2 } from 'lucide-react';

interface ToastInput extends ToastProps {
	title: string;
	description: string;
	variant?: 'default' | 'destructive';
}

interface CreateCategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCategoryCreated: (categoryName: string) => void;
}

interface ApiError {
	status?: number;
	data?: {
		message?: string | string[];
	};
}

export const CreateCategoryDialog = ({
	open,
	onOpenChange,
	onCategoryCreated,
}: CreateCategoryDialogProps) => {
	const { toast } = useToast();
	const [newCategoryName, setNewCategoryName] = useState('');
	const [createCategory, { isLoading }] = useCreateCategoryMutation();

	const handleCreate = async () => {
		if (!newCategoryName.trim()) return;
		try {
			await createCategory({ name: newCategoryName }).unwrap();

			toast({
				title: 'Category Created',
				description: `Category "${newCategoryName}" has been added.`,
			} as ToastInput);

			onCategoryCreated(newCategoryName);
			setNewCategoryName('');
			onOpenChange(false);
		} catch (error: unknown) {
			const err = error as ApiError;
			console.error('Failed to create category', err);

			let errorMessage = 'Failed to create category.';

			if (err?.data?.message) {
				errorMessage = Array.isArray(err.data.message)
					? err.data.message[0]
					: err.data.message;
			} else if (err.status === 409) {
				errorMessage = 'Category already exists.';
			}

			toast({
				variant: 'destructive',
				title: 'Creation Failed',
				description: errorMessage,
			} as ToastInput);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Category</DialogTitle>
				</DialogHeader>
				<div className='py-4'>
					<Input
						placeholder='Category Name'
						value={newCategoryName}
						onChange={e => setNewCategoryName(e.target.value)}
						onKeyDown={e => e.key === 'Enter' && handleCreate()}
						className='bg-background'
					/>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={isLoading || !newCategoryName.trim()}
					>
						{isLoading ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							'Create'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
