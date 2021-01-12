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

app.get('/buckets-runtime', async (req, res) => {
  const movies = await dbManager.getMovies();
  const result = await movies
    .aggregate([
      {
        $bucket: {
          groupBy: '$runtime',
          boundaries: [0, 60, 90, 120],
          default: 'autres durées',
          output: {
            nb: { $sum: 1 },
            films: {
              $push: {
                title: '$title',
                duration: '$runtime',
              },
            },
          },
        },
      },
    ])
    .toArray();
  res.status(200).json(result);
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

app.get('/duration-by-year', async (req, res) => {
  try {
    const movies = await dbManager.getMovies();
    const result = await movies.aggregate([
      {
        $match: {
          type: 'series',
        },
      },
      {
        $group: {
          _id: '$year',
          averageDuration: { $avg: '$runtime' },
          nb: { $sum: 1 },
        },
      },
      {
        $sort: { nb: -1 },
      },
    ]);
    const data = await result.toArray();
    console.log('result');
    res.status(200).json(data);
  } catch (err) {
    console.log('error');
    res.status(500).json(err);
  }
});

app.get('/number-of-comments-by-film', async (req, res) => {
  const comments = await dbManager.getCollection('sample_mflix', 'comments');
  const result = await comments
    .aggregate([
      {
        $group: {
          _id: '$movie_id',
          nb: { $sum: 1 },
        },
      },
      { $sort: { nb: -1 } },
    ])
    .limit(50)
    .toArray();

  res.status(200).json(result);
});

app.get('/comment/:id', async (req, res) => {
  try {
    const comments = await dbManager.getCollection('sample_mflix', 'comments');
    const result = await comments
      .aggregate([
        {
          $match: {
            movie_id: new dbManager.ObjectID(req.params.id),
          },
        },
        {
          $lookup: {
            from: 'movies',
            localField: 'movie_id',
            foreignField: '_id',
            as: 'movieDetails',
          },
        },
      ])
      .limit(50)
      .toArray();
    res.json(result);
  } catch (err) {
    res.json(err);
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
