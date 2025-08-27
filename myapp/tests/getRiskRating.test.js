const request = require("supertest");
const app = require("../app");

// Test suite for GET /api/getRiskRating
// GET test response from /api/getRiskRating
describe("GET /api/getRiskRating", () => {
  it("1: should return a risk rating", async () => {
    const response = await request(app).get("/api/getRiskRating");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
  });
});

// Test suite for POST /api/getRiskRating
describe("POST /api/getRiskRating", () => {
  /**
   * Test Case 1. Sunny day scenario - multiple keywords
   * - Verifies basic functionality with realistic input
   * containing multiple keywords ("crash", "scratch", "crashes")
   */
  it("1: should return a risk rating for multiple keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory:
        "My only claim was a crash into my house's garage door that left a scratch on my car. There are no other crashes.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(3);
  });

  /**
   * Test Case 2. Clean record - no keywords found
   * - Confirms API returns minimum rating (1) when no risk keywords are present
   */
  it("2: should return a risk rating of 1 for no keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "No claims in the past 3 years. Clean driving record.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(1);
  });

  /**
   * Test Case 3. Multiple occurrences of same keyword
   * - Tests that repeated instances of the same keyword are
   *   counted separately (3 "crash" + base 1 = 4)
   */
  it("3: should return a risk rating of 4 for multiple crashes", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory:
        "I had a crash last year, another crash this year, and a third crash last week.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 4. Multiple different keywords in one sentence
   * - Validates detection of different keywords
   *   ("bump", "dent", "scratch") in a single sentence
   */
  it("4: should return a risk rating of 4 for multiple different keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "Minor bump in parking lot caused a small smash and scratch on bumper.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 5. Mix of different keywords
   * - Tests counting of varied keywords ("collide", "smash") in complex sentence structure
   */
  it("5: should return a risk rating of 3 for mixed keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory:
        "Severe accident where I collide with another car, causing it to smash into a tree.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(3);
  });

  /**
   * Test Case 6. Case sensitivity test - uppercase
   * - Verifies that keywords are detected regardless of case (uppercase)
   */
  it("6: should detect uppercase keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "CRASH, SCRATCH, BUMP - all uppercase incidents.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 7. Case sensitivity test - lowercase
   * - Verifies that keywords are detected regardless of case (lowercase)
   */
  it("7: should detect lowercase keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "crash, scratch, bump - all lowercase incidents.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 8. Case sensitivity test - mixed case
   * - Verifies that keywords are detected regardless of case (mixed case)
   */
  it("8: should detect mixed case keywords", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "CrAsH, ScRaTcH, bUmP - mixed case incidents.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 9. Same keyword multiple times in one sentence
   * - Tests that the same keyword is counted each time it appears, even within one sentence
   */
  it("9: should count repeated keywords in same sentence", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "I had a crash into another car that had a crash at the crash site.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 10. Boundary test - maximum risk rating (6+ keywords)
   * - Validates that risk rating caps at maximum value (5) even when more than 5 keywords are present
   */
  it("10: should cap risk rating at maximum value of 5", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "collide collide collide collide collide collide",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(5);
  });

  /**
   * Test Case 11. Minimum valid input - single keyword
   * - Tests minimal input with exactly one keyword (base 1 + 1 keyword = 2)
   */
  it("11: should return risk rating of 2 for single keyword", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "scratch",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(2);
  });

  /**
   * Test Case 12. Empty string - should return minimum rating
   * - Verifies handling of empty string input returns minimum risk rating
   */
  it("12: should return risk rating of 1 for empty string", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(1);
  });

  /**
   * Test Case 13. Whitespace only - should return minimum rating
   * - Tests that whitespace-only input is treated as having no keywords
   */
  it("13: should return risk rating of 1 for whitespace only", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "   ",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(1);
  });

  /**
   * Test Case 14. Keywords in non-accident context
   * - Validates that keywords are counted regardless of context (even non-driving related usage)
   */
  it("14: should count keywords regardless of context", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "I love to crash parties and scratch lottery tickets while bump into friends.",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(4);
  });

  /**
   * Test Case 15. Similar but different words - should not count
   * - Ensures only exact keyword matches are counted, not similar words or word variations
   */
  it("15: should not count similar words that are not exact matches", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: "crasher, scratches, bumping, smashing, collides",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("riskRating");
    expect(response.body.riskRating).toEqual(1);
  });

  /**
   * Test Case 16. Missing required field
   * - Tests error handling when required "claimHistory" field is completely missing
   */
  it("16: should return error when claimHistory field is missing", async () => {
    const response = await request(app).post("/api/getRiskRating").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("there is an error");
  });

  /**
   * Test Case 17. Null value for claimHistory
   * - Validates proper error response when claimHistory field is null
   */
  it("17: should return error when claimHistory is null", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: null,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("there is an error");
  });

  /**
   * Test Case 18. Wrong data type - number instead of string
   * - Tests error handling for incorrect data type (number when string expected)
   */
  it("18: should return error for number data type", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      claimHistory: 12345,
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("there is an error");
  });

  /**
   * Test Case 19. Wrong data type - array instead of string
   * - Tests error handling for incorrect data type (array when string expected)
   */
  it("19: should return error for array data type", async () => {
    const response = await request(app)
      .post("/api/getRiskRating")
      .send({
        claimHistory: ["crash", "scratch"],
      });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("there is an error");
  });

  /**
   * Test Case 20. Wrong field name
   * - Validates error response when correct field name is not used
   */
  it("20: should return error for wrong field name", async () => {
    const response = await request(app).post("/api/getRiskRating").send({
      wrongField: "I had a crash",
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("there is an error");
  });
});
