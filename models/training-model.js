const Mongoose = require('mongoose');

const TrainingSchema = new Mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  duration: Number,
  startingDate: { type: Date, required: true },
  endingDate: { type: Date, required: true },
  skills: [String],
  trainees: [{ name: String, firstName: String, birthDate: Date }],
});

const Training = Mongoose.model('trainings', TrainingSchema);

module.exports = Training;
