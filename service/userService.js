const UserModel = require('../models/UserModel')

const createUser = async (username) => {
  try {
    const user = await UserModel.create({ username: username })
    return user
  } catch (error) {
    return error
  }
}

const findByUsername = async (username) => {
  //check name is not repeated
  const existingUser = await UserModel.findOne({ username: username })
  return existingUser
}

const findById = async (id) => {
  return await UserModel.findById(id)
}

const findAll = async () => {
  return await UserModel.find()
}

const getUserLogs = async (id) => {
  return UserModel.findById(id).populate('logs')
}

module.exports = {
  createUser,
  findByUsername,
  findById,
  findAll,
  getUserLogs,
}
