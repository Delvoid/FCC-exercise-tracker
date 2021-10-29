const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter an username'],
      unique: true,
      minlength: [3, 'Minimun username length is 3 characters'],
      trim: true,
    },
    logs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercises',
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Users', UserSchema)
