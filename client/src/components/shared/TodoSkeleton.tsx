import { Skeleton } from '@/components/ui/skeleton';

export function TodoSkeleton() {
	return (
		<div className='flex items-center gap-3 p-4 bg-card border border-border rounded-lg'>
			<Skeleton className='h-6 w-6 rounded-full shrink-0' />

			<div className='flex-1 space-y-2'>
				<Skeleton className='h-5 w-3/4' />
				<div className='flex gap-2'>
					<Skeleton className='h-5 w-20 rounded-full' />
					<Skeleton className='h-5 w-16 rounded-full' />
					<Skeleton className='h-5 w-16 rounded-full' />
				</div>
			</div>
			<Skeleton className='h-8 w-8 rounded-md shrink-0' />
		</div>
	);
}
