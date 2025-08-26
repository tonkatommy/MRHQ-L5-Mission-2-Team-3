const request = require("supertest");
const app = require("../app");

describe("GET /api/getRiskRating", () => {
  it("should return a risk rating", async () => {
    const response = await request(app).get("/api/getRiskRating");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
  });
});
