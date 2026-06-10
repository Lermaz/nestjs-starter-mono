import assert from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import {
  createTestApp,
  registerAndLogin,
  type TodoResponseBody,
} from './helpers/test-app';

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

  void it('GET /todos does not return another user todos', async () => {
    const otherUserToken = await registerAndLogin(
      app,
      'other-user@example.com',
    );
    await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'User A todo' });
    const listResponse = await request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${otherUserToken}`);
    assert.strictEqual(listResponse.status, 200);
    const todos = listResponse.body as TodoResponseBody[];
    assert.strictEqual(todos.length, 0);
  });

  void it('GET /todos/:id returns 404 for another user todo', async () => {
    const otherUserToken = await registerAndLogin(
      app,
      'isolation-user@example.com',
    );
    const createResponse = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Private todo' });
    const createdTodo = createResponse.body as TodoResponseBody;
    const getResponse = await request(app.getHttpServer())
      .get(`/todos/${createdTodo.id}`)
      .set('Authorization', `Bearer ${otherUserToken}`);
    assert.strictEqual(getResponse.status, 404);
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
