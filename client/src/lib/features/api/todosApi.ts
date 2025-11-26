import { RootState } from '@/lib/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
	id: string;
	title: string;
	isDone: boolean;
	priority: number;
	category: string;
	dueDate?: string | null;
	createdAt: string;
	order: number;
}

export interface Category {
	id: string;
	name: string;
}

export interface GetTodosParams {
	status?: 'all' | 'done' | 'undone';
	search?: string;
	sortBy?: 'createdAt' | 'priority' | 'order';
	sortOrder?: 'asc' | 'desc';
	category?: string;
}

export interface CreateTodoDto {
	title: string;
	priority?: number;
	category?: string;
	dueDate?: string | null;
}

export interface UpdateTodoDto {
	id: string;
	title?: string;
	isDone?: boolean;
	priority?: number;
	category?: string;
	order?: number;
	dueDate?: string | null;
}

export const todosApi = createApi({
	reducerPath: 'todosApi',
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	tagTypes: ['Todos', 'Categories'],
	endpoints: builder => ({
		getTodos: builder.query<Todo[], GetTodosParams>({
			query: (params: GetTodosParams) => {
				const category = params.category?.toLowerCase();

				return {
					url: 'todos',
					params: {
						...params,
						search: params.search || undefined,
						category:
							category === 'all' || !category ? undefined : params.category,
						status: params.status === 'all' ? undefined : params.status,
					},
				};
			},
			providesTags: result =>
				result
					? [
							...result.map(({ id }) => ({ type: 'Todos' as const, id })),
							{ type: 'Todos', id: 'LIST' },
					  ]
					: [{ type: 'Todos', id: 'LIST' }],
		}),

		createTodo: builder.mutation<Todo, CreateTodoDto>({
			query: (body: CreateTodoDto) => ({
				url: 'todos',
				method: 'POST',
				body,
			}),
			invalidatesTags: [{ type: 'Todos', id: 'LIST' }],
		}),

		updateTodo: builder.mutation<Todo, UpdateTodoDto>({
			query: ({ id, ...body }: UpdateTodoDto) => ({
				url: `todos/${id}`,
				method: 'PATCH',
				body,
			}),

			async onQueryStarted(
				{ id, ...patch },
				{ dispatch, queryFulfilled, getState }
			) {
				if (patch.order !== undefined) {
					return;
				}

				const state = getState() as RootState;
				const filters = state.filters;

				const patchResult = dispatch(
					todosApi.util.updateQueryData('getTodos', filters, draft => {
						const todo = draft.find(t => t.id === id);
						if (todo) {
							Object.assign(todo, patch);
						}
					})
				);

				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},

			invalidatesTags: (result, error, arg) =>
				arg.order
					? [{ type: 'Todos', id: 'LIST' }]
					: [{ type: 'Todos', id: arg.id }],
		}),

		deleteTodo: builder.mutation<void, string>({
			query: (id: string) => ({
				url: `todos/${id}`,
				method: 'DELETE',
			}),

			async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
				const state = getState() as RootState;
				const filters = state.filters;

				const patchResult = dispatch(
					todosApi.util.updateQueryData('getTodos', filters, draft => {
						const index = draft.findIndex(t => t.id === id);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				);

				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
			invalidatesTags: (result, error, id) => [
				{ type: 'Todos', id },
				{ type: 'Todos', id: 'LIST' },
			],
		}),

		getCategories: builder.query<Category[], void>({
			query: () => 'categories',
			providesTags: ['Categories'],
		}),

		createCategory: builder.mutation<Category, { name: string }>({
			query: (body: { name: string }) => ({
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
} = todosApi;
