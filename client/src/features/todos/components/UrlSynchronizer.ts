'use client';

import type { GetTodosParams } from '@/features/todos/api/todosApi';
import {
	setFilterCategory,
	setFilterStatus,
	setSearchQuery,
	setSort,
} from '@/features/todos/model/filterSlice';
import { useAppDispatch } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const DEFAULT_FILTERS = {
	status: 'all',
	sortBy: 'order',
	sortOrder: 'desc',
	category: 'all',
	search: '',
};

export const UrlSynchronizer = () => {
	const searchParams = useSearchParams();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const currentStatus = searchParams.get('status') || DEFAULT_FILTERS.status;
		const currentCategory =
			searchParams.get('category') || DEFAULT_FILTERS.category;
		const currentSortBy = searchParams.get('sortBy') || DEFAULT_FILTERS.sortBy;
		const currentSortOrder =
			searchParams.get('sortOrder') || DEFAULT_FILTERS.sortOrder;
		const currentSearch = searchParams.get('search') || DEFAULT_FILTERS.search;

		dispatch(setFilterStatus(currentStatus as GetTodosParams['status']));
		dispatch(setFilterCategory(currentCategory));
		dispatch(
			setSort({
				sortBy: currentSortBy as GetTodosParams['sortBy'],
				sortOrder: currentSortOrder as GetTodosParams['sortOrder'],
			})
		);
		dispatch(setSearchQuery(currentSearch));
	}, [searchParams, dispatch]);

	return null;
};
