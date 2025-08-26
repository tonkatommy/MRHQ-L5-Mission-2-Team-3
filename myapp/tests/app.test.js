const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("responds with 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});

describe("POST /carValue", () => {
  it.todo("get car value");
});

describe("POST /getRiskRating", () => {
  it.todo("get risk rating");
});

describe("POST /getQuote", () => {
  it("returns correct quote", async () => {
    const body = {car_value: 6614, risk_rating: 5};
    const res = await request(app).post("/getQuote").send(body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({monthly_premium: 27.56, yearly_premium: 330.7});
  });
  it("handles non-numeric values", async () => {
    const body = {car_value: "%abc", risk_rating: "!def"};
    const res = await request(app).post("/getQuote").send(body);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "value is not a number");
  });
  it("handles values equal to or less than 0", async () => {
    const body = {car_value: -6614, risk_rating: 0};
    const res = await request(app).post("/getQuote").send(body);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "values must be greater than 0");
  });
});

describe("POST /getDiscount", () => {
  it("Returns correct discount for age and experience", async () => {
    const body = {age: 30, experience: 6};
    const res = await request(app).post("/getDiscount").send(body);
    expect(res.body.discount).toBe(10);
  });
  it("Handles missing query parameters", async () => {
    const body = {};
    const res = await request(app).post("/getDiscount").send(body);
    expect(res.status).toBe(400);
  });
  it("Handles non-numeric values", async () => {
    const body = {age: "thirty", experience: "six"};
    const res = await request(app).post("/getDiscount").send(body);
    expect(res.status).toBe(400);
  });
  it("Handles negative values", async () => {
    const body = {age: -5, experience: -2};
    const res = await request(app).post("/getDiscount").send(body);
    expect(res.status).toBe(400);
  });
  it("Handles zero values", async () => {
    const body = {age: 0, experience: 0};
    const res = await request(app).post("/getDiscount").send(body);
    expect(res.status).toBe(400);
  });
});
