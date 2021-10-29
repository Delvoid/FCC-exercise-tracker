const request = require('supertest')
const app = require('../app')
const { createUser } = require('../service/userService')
const UserModel = require('../models/UserModel')
const connectDb = require('../utils/connectDb')
const { createExercise } = require('../service/exerciseService')
const ExerciseModel = require('../models/ExerciseModel')

let dbConnection
let user

beforeAll(async () => {
  dbConnection = await connectDb()
})

afterAll(async () => {
  await dbConnection.collection('users').deleteMany({})
  await dbConnection.collection('exercises').deleteMany({})
  await dbConnection.close()
})
beforeEach(async () => {
  await dbConnection.collection('users').deleteMany({})
  await dbConnection.collection('exercises').deleteMany({})
  user = await makeUser()
})

const validExercise = {
  date: '1991-07-21',
  duration: 30,
  description: 'test',
}

const makeUser = async (username = 'Delvoid') => {
  const user = await UserModel.create({ username })
  return user
}

const postExercise = (id, formData = validExercise) => {
  return request(app)
    .post(`/api/users/${id}/exercises`)
    .send({
      ...formData,
    })
}

describe('Create Exercise', () => {
  test('createExercise function exisits', () => {
    expect(typeof createExercise).toEqual('function')
  })

  describe('Given a valid username', () => {
    it('should save the exercise to the database', async () => {
      await createExercise({ ...validExercise, _id: user._id })
      //check db
      const exercises = await ExerciseModel.find().populate('user')
      expect(exercises.length).toBe(1)
    })
    it('should update the user logs when creating a exercise', async () => {
      await createExercise({ ...validExercise, _id: user._id })
      //check db
      const updatedUser = await UserModel.find()
      expect(updatedUser[0].logs.length).toBe(1)
    })
    it('response should return user, date, duration, description ', async () => {
      const createdExercise = await createExercise({ ...validExercise, _id: user._id })
      expect(createdExercise.user).toBeDefined()
      expect(createdExercise.user.username).toBeDefined()
      expect(createdExercise.date).toBeDefined()
      expect(createdExercise.duration).toBeDefined()
      expect(createdExercise.description).toBeDefined()
    })
  })
})
describe('POST /api/users/:id/exercises, Create a user exercise', () => {
  describe('Given a valid user ID', () => {
    it('should response with a 200 status code', async () => {
      const res = await postExercise(user._id)
      expect(res.status).toBe(200)
    })
    it('should return 422 error if duration is missing ', async () => {
      const res = await postExercise(user._id, { ...validExercise, duration: null })
      expect(res.status).toBe(422)
    })
    it('should return 422 error if description is missing ', async () => {
      const res = await postExercise(user._id, { ...validExercise, description: null })
      expect(res.status).toBe(422)
    })
    it('returns Errors field in response body when validation error occurs', async () => {
      const res = await postExercise(user._id, { ...validExercise, duration: null })
      const body = res.body
      expect(body.errors).not.toBeUndefined()
    })
    it('returns Errors for both duration and description when null', async () => {
      const res = await postExercise(user._id, {
        ...validExercise,
        duration: null,
        description: null,
      })
      const body = res.body
      expect(Object.keys(body.errors)).toEqual(['duration', 'description'])
    })
    it('response should contain id', async () => {
      const res = await postExercise(user._id)
      expect(res.body._id).toBeDefined()
      expect(res.body._id).toEqual(expect.any(String))
    })
    it('response should contain username', async () => {
      const res = await postExercise(user._id)
      expect(res.body.username).toBeDefined()
      expect(res.body.username).toEqual(user.username)
    })
    it('response should contain duration', async () => {
      const res = await postExercise(user._id)
      expect(res.body.duration).toBeDefined()
      expect(res.body.duration).toEqual(expect.any(Number))
    })
    it('response should contain description', async () => {
      const res = await postExercise(user._id)
      expect(res.body.description).toBeDefined()
      expect(res.body.description).toEqual(expect.any(String))
    })
    it('response should contain date', async () => {
      const res = await postExercise(user._id)
      const date = new Date(validExercise.date).toDateString()
      expect(res.body.date).toBeDefined()
      expect(res.body.date).toEqual(date)
    })
    it('returns todays date if date is not passed ', async () => {
      const res = await postExercise(user._id, { ...validExercise, date: null })
      const date = new Date().toDateString()
      expect(res.body.date).toEqual(date)
    })
    it('should save user to database ', async () => {
      await postExercise(user._id)
      const exercises = await ExerciseModel.find()
      expect(exercises.length).toBe(1)
    })
  })

  describe('Given a invalid user ID', () => {
    it('should return a 404 error', async () => {
      const res = await postExercise('abc')
      expect(res.status).toBe(404)
    })
  })
})
