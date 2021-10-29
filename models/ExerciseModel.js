const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExerciseSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    date: { type: String },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Exercises', ExerciseSchema)
