const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
  //First checks for missing parameters
  const missingParams = checkForMissingParams({
    carValue: req.body.car_value,
    riskRating: req.body.risk_rating,
  });

  if (missingParams.length > 0) {
    return res
      .status(400)
      .json({error: `${missingParams.join(", ")} not provided`});
  }

  const carValue = Number(req.body.car_value);
  const riskRating = Number(req.body.risk_rating);

  if (isNaN(carValue) || isNaN(riskRating)) {
    return res.status(400).json({error: "value is not a number"});
  }

  if (riskRating < 1 || riskRating > 5) {
    return res.status(400).json({error: "risk rating must be between 1 and 5"});
  }

  if (carValue <= 0) {
    return res.status(400).json({error: "values must be greater than 0"});
  }

  return res.status(200).json(calculatePremium(carValue, riskRating));
});

// ===========================HELPER FUNCTIONS==========================
const calculatePremium = (carValue, riskRating) => {
  const yearly = (carValue * riskRating) / 100;
  const monthly = yearly / 12;

  return {
    yearly_premium: +yearly.toFixed(2),
    monthly_premium: +monthly.toFixed(2),
  };
};

const checkForMissingParams = ({carValue, riskRating}) => {
  const missingParams = [];
  if (carValue === undefined) missingParams.push("carValue");
  if (riskRating === undefined) missingParams.push("riskRating");
  return missingParams;
};

module.exports = router;
