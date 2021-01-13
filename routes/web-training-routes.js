const router = require('express').Router();

const Training = require('../models/training-model');

router.get('/form', (req, res) => {
  res.render('training/form');
});

router.post('/form', async (req, res) => {
  try {
    const training = new Training(req.body);
    await training.save();
    res.redirect('/formation');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  const trainingList = await Training.find();
  res.render('training/home', { trainingList });
});

module.exports = router;
