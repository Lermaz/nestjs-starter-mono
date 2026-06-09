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

interface AuthResponseBody {
  readonly accessToken: string;
}

const nodeRequire = createRequire(__filename);

async function createTestApp(): Promise<INestApplication<App>> {
  process.env.DATABASE_URL = 'sqlite://:memory:';
  process.env.JWT_SECRET = 'e2e-test-secret';
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

async function registerAndLogin(
  app: INestApplication<App>,
  email: string,
): Promise<string> {
  const password = 'password123';
  await request(app.getHttpServer())
    .post('/auth/register')
    .send({ email, password });
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email, password });
  const authBody = loginResponse.body as AuthResponseBody;
  return authBody.accessToken;
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

void describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  void it('POST /auth/register and POST /auth/login return access token', async () => {
    const email = 'e2e-user@example.com';
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'password123' });
    assert.strictEqual(registerResponse.status, 201);
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password123' });
    assert.strictEqual(loginResponse.status, 201);
    const authBody = loginResponse.body as AuthResponseBody;
    assert.strictEqual(typeof authBody.accessToken, 'string');
  });
});

void describe('TodosController (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;

  beforeEach(async () => {
    app = await createTestApp();
    accessToken = await registerAndLogin(app, 'todos-user@example.com');
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

  void it('GET /todos returns 401 without token', async () => {
    const response = await request(app.getHttpServer()).get('/todos');
    assert.strictEqual(response.status, 401);
  });

  void it('POST /todos rejects invalid body', async () => {
    const response = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: '' });
    assert.strictEqual(response.status, 400);
  });

  void it('POST /todos creates and GET /todos lists', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'E2E todo' });
    assert.strictEqual(createResponse.status, 201);
    const createdTodo = createResponse.body as TodoResponseBody;
    assert.strictEqual(createdTodo.title, 'E2E todo');
    assert.strictEqual(createdTodo.isCompleted, false);
    const listResponse = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${accessToken}`);
    assert.strictEqual(listResponse.status, 200);
    const todos = listResponse.body as TodoResponseBody[];
    assert.strictEqual(todos.length, 1);
    assert.strictEqual(todos[0]?.title, 'E2E todo');
  });

  void it('GET /todos/:id returns 404 for unknown id', async () => {
    const response = await request(app.getHttpServer())
      .get('/todos/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${accessToken}`);
    assert.strictEqual(response.status, 404);
  });

  void it('GET /todos/:id returns created todo', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Find me' });
    assert.strictEqual(createResponse.status, 201);
    const createdTodo = createResponse.body as TodoResponseBody;
    const getResponse = await request(app.getHttpServer())
      .get(`/todos/${createdTodo.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    assert.strictEqual(getResponse.status, 200);
    const foundTodo = getResponse.body as TodoResponseBody;
    assert.strictEqual(foundTodo.title, 'Find me');
  });
});
