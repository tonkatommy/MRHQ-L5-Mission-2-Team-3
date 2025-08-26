const request = require("supertest");
const app = require("../app");

describe("GET /api/risk-rating", () => {
  it("should return a risk rating", async () => {
    const response = await request(app).get("/api/risk-rating");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("rating");
  });
});
