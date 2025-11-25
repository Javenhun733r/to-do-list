import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { ValidationMiddleware } from '../middleware/validation.middleware';

const router = Router();
const controller = new TodoController();

router.get('/', controller.getTodos.bind(controller));
router.post(
	'/',
	ValidationMiddleware.validateCreateTodo,
	controller.createTodo.bind(controller)
);
router.patch(
	'/:id',
	ValidationMiddleware.validateUpdateTodo,
	controller.updateTodo.bind(controller)
);
router.delete('/:id', controller.deleteTodo.bind(controller));

export default router;
