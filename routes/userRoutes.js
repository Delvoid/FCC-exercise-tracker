const express = require('express')
const {
  user_create,
  user_create_exercise,
  users_get,
  user_exercises,
} = require('../controllers/userController')
const { userValidationRules, validate } = require('../middleware/formValidator')

const router = express.Router()

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
router.post('/', user_create)

// @desc    Get a list of users
// @route   GET /api/users
// @access  Public
router.get('/', users_get)

// @desc    Create user exercise
// @route   POST /api/users/:id/exercise
// @access  Public
router.post('/:id/exercises', userValidationRules(), validate, user_create_exercise)

// @desc    get user exercises
// @route   GET /api/users/:id/logs
// @access  Public
router.get('/:id/logs', user_exercises)

module.exports = router
