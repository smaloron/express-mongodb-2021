const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const movieRoutes = require('./routes/movie-routes');
const clientRoutes = require('./routes/client-routes');
const trainingRoutes = require('./routes/web-training-routes');

const app = express();

app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use(express.static('assets'));

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/movie', movieRoutes);
app.use('/client', clientRoutes);
app.use('/formation', trainingRoutes);

// Connexion à MongoDB via Mongoose
mongoose
  .connect('mongodb://localhost:27017/formation', { useNewUrlParser: true })
  .then(
    app.listen(3000, () => {
      console.log('app started with Mongoose');
    })
  )
  .catch(err => console.log(err));
