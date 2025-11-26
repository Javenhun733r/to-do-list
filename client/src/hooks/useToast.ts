import * as React from 'react';

import { ToastActionElement, ToastProps } from '@/components/ui/toast';

const TOAST_LIMIT = 1;
const TOAST_DURATION = 3000;

type ToasterToast = ToastProps & {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	action?: ToastActionElement;
};

const state = {
	toasts: [] as ToasterToast[],
	listeners: [] as ((state: ToasterToast[]) => void)[],
};

function dispatch(toast: ToasterToast) {
	state.toasts = [toast, ...state.toasts].slice(0, TOAST_LIMIT);
	state.listeners.forEach(listener => listener(state.toasts));
}

function listen(listener: (state: ToasterToast[]) => void) {
	state.listeners.push(listener);
	return () => {
		state.listeners = state.listeners.filter(l => l !== listener);
	};
}

function createToast({ ...props }: ToastProps) {
	const id = Date.now().toString();

	const toast: ToasterToast = {
		id,
		duration: TOAST_DURATION,
		...props,
	};

	dispatch(toast);
}

function useToast() {
	const [toasts, setToasts] = React.useState(state.toasts);

	React.useEffect(() => {
		return listen(setToasts);
	}, []);

	return {
		toasts,
		toast: createToast,
		dismiss: (id?: string) => {
			if (id) {
				dispatch({
					...state.toasts.find(t => t.id === id),
					open: false,
				} as ToasterToast);
			} else {
				state.toasts.forEach(t =>
					dispatch({ ...t, open: false } as ToasterToast)
				);
			}
		},
	};
}

export { createToast as toast, useToast, type ToastProps };
