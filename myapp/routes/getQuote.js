var express = require("express");
var router = express.Router();

const calculatePremium = (car_value, risk_rating) => {
  const yearlyPremium = (car_value * risk_rating) / 100;
  const monthlyPremium = yearlyPremium / 12;

  return {
    yearly_premium: Number(yearlyPremium.toFixed(1)),
    monthly_premium: Number(monthlyPremium.toFixed(1)),
  };
};

router.post("/", function (req, res, next) {
  const {car_value, risk_rating} = req.body;
  const {yearly_premium, monthly_premium} = calculatePremium(
    car_value,
    risk_rating
  );

  return res.status(200).json({monthly_premium, yearly_premium});
});

module.exports = router;
