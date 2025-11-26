export const getPriorityColor = (priority: number) => {
	if (priority >= 8) return 'text-destructive ...';
	if (priority >= 5) return 'text-yellow-600 ...';
	return 'text-blue-600 ...';
};
