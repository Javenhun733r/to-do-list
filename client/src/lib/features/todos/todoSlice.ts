import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
	id: string;
	title: string;
	isDone: 'done' | 'undone';
	priority: number;
	dueDate: string | null;
	category: string;
	order: number;
}

export interface GetTodosArgs {
	status?: string;
	search?: string;
	sortBy?: string;
	sortOrder?: string;
}
export interface Category {
	id: string;
	name: string;
}
export const todoApi = createApi({
	reducerPath: 'todoApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
	tagTypes: ['Todos', 'Categories'],
	endpoints: builder => ({
		getTodos: builder.query<Todo[], GetTodosArgs>({
			query: params => ({
				url: 'todos',
				params: {
					status: params.status === 'all' ? undefined : params.status,
					search: params.search || undefined,
					sortBy: params.sortBy || 'priority',
					sortOrder: params.sortOrder || 'desc',
				},
			}),
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Todos' as const, id })),
							{ type: 'Todos', id: 'LIST' },
					  ]
					: [{ type: 'Todos', id: 'LIST' }],
		}),
		createTodo: builder.mutation<Todo, Partial<Todo>>({
			query: body => ({
				url: 'todos',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
		}),

		updateTodo: builder.mutation<
			Todo,
			{
				id: string;
				patch: Omit<Partial<Todo>, 'isDone'> & { isDone?: boolean };
			}
		>({
			query: ({ id, patch }) => ({
				url: `todos/${id}`,
				method: 'PATCH',
				body: patch,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Todos', id }],
		}),
		deleteTodo: builder.mutation<void, string>({
			query: id => ({
				url: `todos/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'Todos', id }],
		}),
		getCategories: builder.query<Category[], void>({
			query: () => 'categories',
			providesTags: ['Categories'],
		}),

		createCategory: builder.mutation<Category, { name: string }>({
			query: body => ({
				url: 'categories',
				method: 'POST',
				body,
			}),
			invalidatesTags: ['Categories'],
		}),
	}),
});

export const {
	useGetTodosQuery,
	useCreateTodoMutation,
	useUpdateTodoMutation,
	useDeleteTodoMutation,
	useGetCategoriesQuery,
	useCreateCategoryMutation,
} = todoApi;
