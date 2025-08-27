const request = require("supertest");
const app = require("../app");

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
  it.todo("handles risk rating over 5");
});
