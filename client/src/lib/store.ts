import { configureStore } from '@reduxjs/toolkit';
import { todoApi } from './features/todos/todoSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			[todoApi.reducerPath]: todoApi.reducer,
		},
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware().concat(todoApi.middleware),
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
