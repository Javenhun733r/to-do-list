export const getPriorityColor = (priority: number) => {
	if (priority >= 8)
		return 'text-destructive bg-destructive/10 border-destructive/20';
	if (priority >= 5)
		return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400';
	return 'text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400';
};
