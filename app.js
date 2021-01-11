const express = require('express');
const bodyParser = require('body-parser');
const dbManager = require('./utils/database');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/movie', async (req, res) => {
  try {
    const movies = await dbManager.getMovies();
    const nbMovies = await movies.find().count();
    const pageSize = 10;
    const numberOfPages = Math.ceil(nbMovies / pageSize);
    let page = req.query.page * 1 || 1;
    if (page > numberOfPages) page = 1;
    const offset = (page - 1) * pageSize;
    const results = await movies
      .find(
        {},
        {
          projection: { title: 1, year: 1, directors: 1 },
        }
      )
      .limit(pageSize)
      .skip(offset)
      .toArray();
    res.status(200).json({
      currentPage: page,
      totalPages: numberOfPages,
      data: results,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get('/movie/:id', async (req, res) => {
  try {
    const movies = await dbManager.getMovies();
    const result = await movies.findOne({
      _id: new dbManager.ObjectID(req.params.id),
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/movie', async (req, res) => {
  const movies = await dbManager.getMovies();
  const result = await movies.insertOne(req.body);
  res.status(200).json(result);
});

app.delete('/movie/:id', async (req, res) => {
  try {
    const movies = await dbManager.getMovies();
    const result = await movies.deleteOne({
      _id: new dbManager.ObjectID(req.params.id),
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(3000, async () => {
  console.log('app started');
});
