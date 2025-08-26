var express = require("express");
var router = express.Router();

// Helper: calculate car value
function calculateCarValue(model, year) {
  if (typeof model !== "string" || typeof year !== "number" || isNaN(year)) {
    throw new Error("Invalid input");
  }

  // Normalize model to uppercase and remove non-letters
  const letters = model.toUpperCase().replace(/[^A-Z]/g, "");

  let sum = 0;
  for (let char of letters) {
    sum += char.charCodeAt(0) - 64; // A=65 in ASCII → 1, B=66 → 2, etc.
  }

  return sum * 100 + year;
}

router.post("/", function (req, res, next) {
  try {
    const { model, year } = req.body;
    if (model === undefined || year === undefined) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    if (Number(year) < 0) {
      return res.status(400).json({ error: "Year cannot be negative" });
    }
    const carValue = calculateCarValue(model, Number(year));
    res.status(200).json({ car_value: carValue });
  } catch (err) {
    res.status(400).json({ error: "there is an error" });
  }
});

module.exports = router;
