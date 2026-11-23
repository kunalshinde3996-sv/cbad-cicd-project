const request = require('supertest');
const app = require('./index');

describe('CBAD API Tests', () => {
  test('GET / returns API running message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('CBAD API is running!');
  });

  test('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /tasks returns array', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  test('PATCH /tasks/:id toggles done', async () => {
    const created = await request(app).post('/tasks').send({ title: 'patch me' });
    const id = created.body.task.id;
    const res = await request(app).patch(`/tasks/${id}`).send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.task.done).toBe(true);
    const list = await request(app).get('/tasks');
    expect(list.body.tasks.find(t => t.id === id).done).toBe(true);
  });

  test('PATCH /tasks/:id validates input and existence', async () => {
    const bad = await request(app).patch('/tasks/99999').send({ done: true });
    expect(bad.statusCode).toBe(404);
    const created = await request(app).post('/tasks').send({ title: 'x' });
    const res = await request(app).patch(`/tasks/${created.body.task.id}`).send({ done: 'yes' });
    expect(res.statusCode).toBe(400);
  });
});
