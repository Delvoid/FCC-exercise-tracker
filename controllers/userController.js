const ObjectId = require('mongoose').Types.ObjectId
const UserService = require('../service/userService')
const ExerciseService = require('../service/exerciseService')
const UserModel = require('../models/UserModel')

// CREATE USER
const user_create = async (req, res) => {
  const { username } = req.body
  if (!username) return res.status(400).json({ error: 'Please provide a username' })
  try {
    //check if user alrady exists
    const existsUser = await UserService.findByUsername(username)
    if (existsUser)
      return res.status(400).json({
        error: 'User alraedy Exists',
        _id: existsUser._id,
        username: existsUser.username,
      })

    //create user
    const user = await UserService.createUser(username)
    res.status(200).json({
      _id: user._id,
      username: user.username,
    })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

//CREATE EXERCISE
const user_create_exercise = async (req, res) => {
  const { id } = req.params
  const { duration, description, date } = req.body
  if (!ObjectId.isValid(id)) return res.status(404).send('Not Found')

  const newExercise = await ExerciseService.createExercise({
    _id: id,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    duration,
    description,
  })
  const exercise = {
    _id: id,
    username: newExercise.user.username,
    date: date ? new Date(date).toDateString() : new Date().toDateString(),
    duration: Number(duration),
    description: description,
  }
  res.status(200).json(exercise)
}

// GET USERS
const users_get = async (req, res) => {
  const users = await UserService.findAll()

  if (users.length < 1) return res.status(200).send('No users found')
  res.status(200).json(users)
}

const user_exercises = async (req, res) => {
  const { id } = req.params
  if (!ObjectId.isValid(id)) return res.status(404).send('Not Found')
  const user = await UserService.getUserLogs(id)
  const exercises = {
    _id: id,
    username: user.username,
    count: user.logs.length,
    log: [...user.logs],
  }
  //Filter by date
  if (req.query.from || req.query.to) {
    let fromDate = new Date(0)
    let toDate = new Date()

    if (req.query.from) {
      fromDate = new Date(req.query.from)
    }

    if (req.query.to) {
      toDate = new Date(req.query.to)
    }

    fromDate = fromDate.getTime()
    toDate = toDate.getTime()

    exercises.log = exercises.log.filter((log) => {
      let exerciseDate = new Date(log.date).getTime()
      return exerciseDate >= fromDate && exerciseDate <= toDate
    })
  }

  if (req.query.limit) {
    exercises.log = exercises.log.slice(0, req.query.limit)
  }

  res.status(200).json(exercises)
}

module.exports = {
  user_create,
  user_create_exercise,
  users_get,
  user_exercises,
}
