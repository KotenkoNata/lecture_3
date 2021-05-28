const { response } = require('express');
const express = require('express');
const router = express.Router();
const got = require('got');
const { query, validationResult } = require('express-validator');
require('dotenv').config();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  console.log(process.env.WEATHER_API_KEY);
  next();
  console.log('Time Next: ', Date.now());
});

const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// define the home page route
router.get(
  '/',
  [query('lat').isNumeric(), query('lon').isNumeric(), validator],
  async (req, res, next) => {
    try {
      const { lat, lon } = req.query;
      const apiKey = process.env.WEATHER_API_KEY;

      const response = await got(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          searchParams: {
            lat,
            lon,
            appid: apiKey,
          },
        },
      );

      const { weather, name, wind } = JSON.parse(response.body);
      res.json({ weather, name, wind });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
