import assert from 'node:assert';
import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

interface TodoResponseBody {
  readonly id: string;
  readonly title: string;
  readonly isCompleted: boolean;
  readonly createdAt: string;
}

interface ReadinessResponseBody {
  readonly status: string;
  readonly todosCount: number;
}

const nodeRequire = createRequire(__filename);

async function createTestApp(): Promise<INestApplication<App>> {
  process.env.DATABASE_URL = 'sqlite://:memory:';
  const { AppModule } = nodeRequire('../dist/app.module') as {
    AppModule: new () => unknown;
  };
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.init();
  return app;
}

void describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  void it('GET / returns Hello World', async () => {
    const response = await request(app.getHttpServer()).get('/');
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.text, 'Hello World!');
  });

  void it('GET /health/test returns ok', async () => {
    const response = await request(app.getHttpServer()).get('/health/test');
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { status: 'ok' });
  });

  void it('GET /health/ready returns ok with todos count', async () => {
    const response = await request(app.getHttpServer()).get('/health/ready');
    assert.strictEqual(response.status, 200);
    const readiness = response.body as ReadinessResponseBody;
    assert.strictEqual(readiness.status, 'ok');
    assert.strictEqual(typeof readiness.todosCount, 'number');
  });
});

void describe('TodosController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  void it('GET /todos/admin/test returns ok', async () => {
    const response = await request(app.getHttpServer()).get(
      '/todos/admin/test',
    );
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { status: 'ok' });
  });

  void it('POST /todos rejects invalid body', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: '' });
    assert.strictEqual(response.status, 400);
  });

  void it('POST /todos creates and GET /todos lists', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'E2E todo' });
    assert.strictEqual(createResponse.status, 201);
    const createdTodo = createResponse.body as TodoResponseBody;
    assert.strictEqual(createdTodo.title, 'E2E todo');
    assert.strictEqual(createdTodo.isCompleted, false);
    const listResponse = await request(app.getHttpServer()).get('/todos');
    assert.strictEqual(listResponse.status, 200);
    const todos = listResponse.body as TodoResponseBody[];
    assert.strictEqual(todos.length, 1);
    assert.strictEqual(todos[0]?.title, 'E2E todo');
  });

  void it('GET /todos/:id returns 404 for unknown id', async () => {
    const response = await request(app.getHttpServer()).get(
      '/todos/00000000-0000-0000-0000-000000000000',
    );
    assert.strictEqual(response.status, 404);
  });

  void it('GET /todos/:id returns created todo', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Find me' });
    assert.strictEqual(createResponse.status, 201);
    const createdTodo = createResponse.body as TodoResponseBody;
    const getResponse = await request(app.getHttpServer()).get(
      `/todos/${createdTodo.id}`,
    );
    assert.strictEqual(getResponse.status, 200);
    const foundTodo = getResponse.body as TodoResponseBody;
    assert.strictEqual(foundTodo.title, 'Find me');
  });
});
