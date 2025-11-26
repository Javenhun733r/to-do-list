import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetTodosParams } from '../api/todosApi';

const initialState: GetTodosParams = {
	status: 'all',
	search: '',
	sortBy: 'order',
	sortOrder: 'desc',
	category: 'all',
};

const filterSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setFilterStatus(state, action: PayloadAction<GetTodosParams['status']>) {
			state.status = action.payload;
		},
		setSearchQuery(state, action: PayloadAction<string>) {
			state.search = action.payload;
		},
		setFilterCategory(state, action: PayloadAction<string>) {
			state.category = action.payload;
		},
		setSort(
			state,
			action: PayloadAction<{
				sortBy: GetTodosParams['sortBy'];
				sortOrder: GetTodosParams['sortOrder'];
			}>
		) {
			state.sortBy = action.payload.sortBy;
			state.sortOrder = action.payload.sortOrder;
		},
	},
});

export const { setFilterStatus, setSearchQuery, setSort, setFilterCategory } =
	filterSlice.actions;
export default filterSlice.reducer;
