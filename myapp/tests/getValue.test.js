const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("responds with 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});

describe("POST /api/v1/getValue", () => {
  // 1. Sunny day scenario
  it("returns correct value for Civic 2020", async () => {
    const res = await request(app).post("/api/v1/getValue").send({ model: "Civic", year: 2020 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ car_value: 6620 });
  });

  // 2. Numbers-only model
  it("returns correct value when model is numbers only", async () => {
    const res = await request(app).post("/api/v1/getValue").send({ model: "911", year: 2020 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ car_value: 2020 }); // letters ignored, only year remains
  });

  // 3. Negative year
  it("returns error when year is negative", async () => {
    const res = await request(app).post("/api/v1/getValue").send({ model: "Civic", year: -987 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // 4. Wrong data type for year
  it("returns error when year is non-numeric string", async () => {
    const res = await request(app)
      .post("/api/v1/getValue")
      .send({ model: "Civic", year: "twenty twenty" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // 5. Boundary test with single letter
  it("handles single letter model Z correctly", async () => {
    const res = await request(app).post("/api/v1/getValue").send({ model: "Z", year: 2000 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ car_value: 4600 }); // (26 * 100) + 2000
  });
});
