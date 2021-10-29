const ExerciseModel = require('../models/ExerciseModel')
const UserModel = require('../models/UserModel')

const createExercise = async (body) => {
  const { _id, date, duration, description } = body
  try {
    const exercise = new ExerciseModel({
      user: _id,
      date: date,
      duration: duration,
      description: description,
    })
    const createdExercise = await exercise.save()
    createdExerciase = await createdExercise.populate('user')
    const user = await UserModel.findByIdAndUpdate(_id, {
      $push: {
        logs: {
          _id: createdExercise._id,
        },
      },
    })
    return createdExercise
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createExercise,
}
