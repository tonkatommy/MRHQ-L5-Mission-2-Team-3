const request = require('supertest');
const app = require('../app')

describe('GET /', () => {
  it('responds with 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });
});

describe('POST /carValue', () => {
  it.todo();
})

describe('POST /getRiskRating', () => {
  it.todo();
})

describe('POST /getQuote', () => {
  it.todo();
});

describe('POST /getDiscount', () => {
  it.todo();
})