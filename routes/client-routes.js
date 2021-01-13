const router = require('express').Router();
const Client = require('../models/client-model');
const app = require('./movie-routes');

router.get('/', async (req, res) => {
  const clients = await Client.find();
  console.log(clients[0].fullName);
  res.status(200).json(clients);
});

router.get('/adults', async (req, res) => {
  const clients = await Client.find()
    .select('name firstName age')
    .where('age')
    .gt(18);
  res.status(200).json(clients);
});
router.get('/test', async (req, res) => {
  // Instanciation d'un client
  const newClient = new Client();
  newClient.name = 'Harper';
  newClient.firstName = 'Joe';
  newClient.age = 45;

  // Sauvegarde dans MongoDB
  let result = await newClient.save();

  res.status(200).json({
    result: result,
    data: newClient,
  });
});

router.post('/', async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const result = await newClient.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    for (key in req.body) {
      client[key] = req.body[key];
    }

    const result = await client.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  const result = await Client.findByIdAndDelete(req.params.id);
  res.status(200).json(result);
});

router.post('/upsert', async (req, res) => {
  const result = await Client.updateOne(
    { name: req.body.name, firstName: req.body.firstName },
    req.body,
    { upsert: true }
  );
  res.status(200).json(result);
});

module.exports = router;
