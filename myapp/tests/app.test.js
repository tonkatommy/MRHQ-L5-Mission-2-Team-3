const request = require('supertest');
const app = require('../app')

describe('GET /', () => {
  it('responds with 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});

describe('POST /getDiscount', () => {
  it('Returns correct discount for age and experience', async () => {
    const body = {age: 30, experience: 6}
    const res = await request(app).post('/getDiscount').send(body);
    expect(res.body.discount).toBe(10);
  });
  it('Handles missing query parameters', async () => {
    const body = {}
    const res = await request(app).post('/getDiscount').send(body);
    expect(res.status).toBe(400);
  });
  it('Handles non-numeric values', async () => {
    const body = {age: 'thirty', experience: 'six'}
    const res = await request(app).post('/getDiscount').send(body);
    expect(res.status).toBe(400);
  });
  it('Handles negative values', async () => {
    const body = {age: -5, experience: -2}
    const res = await request(app).post('/getDiscount').send(body);
    expect(res.status).toBe(400);
  });
  it('Handles zero values', async () => {
    const body = {age: 0, experience: 0}
    const res = await request(app).post('/getDiscount').send(body);
    expect(res.status).toBe(400);
  });
});