const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(process.env.WEATHER_API_KEY);
  next();
});

app.use('/', require('./routes/api/weather'));

app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
