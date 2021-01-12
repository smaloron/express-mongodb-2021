const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  firstName: String,
  age: Number,
});

const clientModel = mongoose.model('clients', clientSchema);

module.exports = clientModel;
