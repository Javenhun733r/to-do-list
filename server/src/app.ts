import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/todos', todoRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error('[Error] ', err.stack);

	if (err.code === 'P2025') {
		res.status(404).json({ error: 'Record not found' });
		return;
	}

	res.status(500).json({
		status: 'error',
		message: err.message || 'Internal Server Error',
	});
});

export default app;
