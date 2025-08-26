const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
  const carValue = Number(req.body.car_value);
  const riskRating = Number(req.body.risk_rating);

  if (isNaN(carValue) || isNaN(riskRating)) {
    return res.status(400).json({error: "value is not a number"});
  }

  if (carValue <= 0 || riskRating <= 0) {
    return res.status(400).json({error: "values must be greater than 0"});
  }

  return res.status(200).json(calculatePremium(carValue, riskRating));
});

const calculatePremium = (carValue, riskRating) => {
  const yearly = (carValue * riskRating) / 100;
  const monthly = yearly / 12;

  return {
    yearly_premium: +yearly.toFixed(2),
    monthly_premium: +monthly.toFixed(2),
  };
};

module.exports = router;
