import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { todosApi } from '../features/todos/api/todosApi';
import filterReducer from '../features/todos/model/filterSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			[todosApi.reducerPath]: todosApi.reducer,
			filters: filterReducer,
		},
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(todosApi.middleware),
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
