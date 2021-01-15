const router = require('express').Router();

const Training = require('../models/training-model');

router.get('/form', (req, res) => {
  res.render('training/form');
});

router.post('/form', async (req, res) => {
  console.log(req.body.trainees);
  try {
    let training = {};

    const newTrainees = [];
    const data = req.body.trainees[0] || [];

    if (0 in data.name) {
      for (val of data.name) {
        newTrainees.push({ name: val });
      }

      for (index in data.firstName) {
        newTrainees[index].firstName = data.firstName[index];
      }

      for (index in data.birthDate) {
        if (data.birthDate[index]) {
          newTrainees[index].birthDate = new Date(data.birthDate[index]);
        }
      }
    } else {
      newTrainees.push(data);
      console.log(data);
    }

    req.body.trainees = newTrainees;
    delete req.body.trainees;

    console.log(newTrainees);

    if ('_id' in req.body) {
      console.log('update');
      training = await Training.findById(req.body._id);
      for (key in req.body) {
        training[key] = req.body[key];
      }
      training.trainees = newTrainees;
    } else {
      console.log('save');
      //console.log(req.body);

      training = new Training(req.body);
      training.trainees = newTrainees;
      //console.log(training);
    }
    //res.json({ training, newTrainees });
    await training.save();
    res.redirect('/formation');
  } catch (err) {
    console.log('err');
    //console.log(req.body);
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  const trainingList = await Training.find();
  res.render('training/home', { trainingList });
});

router.get('/delete/:id', async (req, res) => {
  await Training.findByIdAndDelete(req.params.id);
  res.redirect('/formation');
});

router.get('/form/:id', async (req, res) => {
  const training = await Training.findById(req.params.id);
  console.log(training);
  res.render('training/form', { training: training });
});

module.exports = router;
