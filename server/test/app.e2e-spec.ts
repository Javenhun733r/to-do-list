import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { TodoResponseDTO } from '../src/todos/dto/todo.dto';
import { AppModule } from './../src/app.module';

describe('Todo App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Categories', () => {
    it('/categories (GET)', () => {
      return request(app.getHttpServer() as unknown as App)
        .get('/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body as unknown)).toBe(true);
        });
    });
  });

  describe('Todos Flow', () => {
    let createdTodoId: string;

    it('/todos (POST) - should create a todo', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .post('/todos')
        .send({
          title: 'E2E Test Task',
          priority: 5,
          category: 'General',
        })
        .expect(201);

      const body = response.body as TodoResponseDTO;

      createdTodoId = body.id;
      expect(body.title).toBe('E2E Test Task');
      expect(body.category).toBeDefined();
    });

    it('/todos (GET) - should return list including created todo', async () => {
      const response = await request(app.getHttpServer() as unknown as App)
        .get('/todos')
        .expect(200);

      const body = response.body as TodoResponseDTO[];

      const todo = body.find((t) => t.id === createdTodoId);
      expect(todo).toBeDefined();

      expect(todo?.title).toBe('E2E Test Task');
    });

    it('/todos/:id (PATCH) - should update todo status', () => {
      return request(app.getHttpServer() as unknown as App)
        .patch(`/todos/${createdTodoId}`)
        .send({ isDone: true })
        .expect(200)
        .expect((res) => {
          const body = res.body as TodoResponseDTO;

          expect(body.isDone).toBe(true);
        });
    });

    it('/todos/:id (DELETE) - should delete todo', () => {
      return request(app.getHttpServer() as unknown as App)
        .delete(`/todos/${createdTodoId}`)
        .expect(200);
    });
  });
});
