const app = require('express').Router();
const dbManager = require('../utils/database');

app.get('/', async (req, res) => {
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

app.get('/number-by-year', async (req, res) => {
  try {
    const movies = await dbManager.getMovies();
    const result = await movies.aggregate([
      {
        $group: {
          _id: '$year',
          nb: { $sum: 1 },
        },
      },
    ]);
    const data = await result.toArray();
    console.log('result');
    res.status(200).json(data);
  } catch (err) {
    console.log('error');
    console.status(500).json(err);
  }
});

app.get('/:id', async (req, res) => {
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

app.post('/', async (req, res) => {
  try {
    const movies = await dbManager.getMovies();
    const result = await movies.insertOne(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.delete('/:id', async (req, res) => {
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

app.put('/:id', async (req, res) => {
  const movies = await dbManager.getMovies();
  const result = await movies.updateOne(
    { _id: new dbManager.ObjectID(req.params.id) },
    { $set: req.body }
  );
  res.status(200).json(result);
});

module.exports = app;
