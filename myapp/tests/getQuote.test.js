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
  it("handles risk ratings not between 1 and 5", async () => {
    const body = {car_value: 6614, risk_rating: 7};
    const res = await request(app).post("/getQuote").send(body);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "risk rating must be between 1 and 5"
    );
  });
  it("handles negative car value", async () => {
    const body = {car_value: -6614, risk_rating: 3};
    const res = await request(app).post("/getQuote").send(body);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "values must be greater than 0");
  });
  //missing params tests grouped in test.each block
  test.each([
    [{}, "carValue, riskRating not provided"],
    [{car_value: 6614}, "riskRating not provided"],
    [{risk_rating: 3}, "carValue not provided"],
  ])("handles missing parameters", async (body, expectedError) => {
    const res = await request(app).post("/getQuote").send(body);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", expectedError);
  });
});
