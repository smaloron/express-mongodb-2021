const express = require('express');
const bodyParser = require('body-parser');

const movieRoutes = require('./routes/movie-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/movie', movieRoutes);

app.listen(3000, async () => {
  console.log('app started');
});
