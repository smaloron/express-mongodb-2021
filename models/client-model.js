const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    set: value => value.toUpperCase(),
    get: value => value.toUpperCase(),
    //match: [/[a-z]{3,10}/i, 'Le nom doit comporter entre 3 et 10 caractères'],
    validate: {
      message: 'Le nom doit comporter entre 3 et 10 caractères',
      validator: value => {
        return value.length <= 10 && value.length >= 3;
      },
    },
  },
  firstName: String,
  age: { type: Number, select: false, default: 18 },
});

clientSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.name;
});

const clientModel = mongoose.model('clients', clientSchema);

module.exports = clientModel;
