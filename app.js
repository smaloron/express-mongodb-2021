const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const movieRoutes = require('./routes/movie-routes');
const clientRoutes = require('./routes/client-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/movie', movieRoutes);
app.use('/client', clientRoutes);

// Connexion à MongoDB via Mongoose
mongoose
  .connect('mongodb://localhost:27017/formation', { useNewUrlParser: true })
  .then(
    app.listen(3000, () => {
      console.log('app started with Mongoose');
    })
  )
  .catch(err => console.log(err));
