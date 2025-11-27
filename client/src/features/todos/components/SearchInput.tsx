'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const SearchInput = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const searchQuery = searchParams.get('search') || '';

	const [value, setValue] = useState(searchQuery);

	const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

	if (searchQuery !== prevSearchQuery) {
		setValue(searchQuery);
		setPrevSearchQuery(searchQuery);
	}

	const debouncedValue = useDebounce(value, 500);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (debouncedValue) {
			params.set('search', debouncedValue);
		} else {
			params.delete('search');
		}

		if (params.toString() !== searchParams.toString()) {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		}
	}, [debouncedValue, pathname, router, searchParams]);

	return (
		<div className='relative w-full md:flex-1'>
			<Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
			<Input
				placeholder='Search tasks...'
				value={value}
				onChange={e => setValue(e.target.value)}
				className='pl-9 bg-background'
			/>
		</div>
	);
};
