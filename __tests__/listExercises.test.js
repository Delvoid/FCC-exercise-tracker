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
const getExercise = (id) => {
  return request(app).get(`/api/users/${id}/logs`)
}

describe('POST /api/users/:id/exercises, Create a user exercise', () => {
  describe('Given a valid user ID', () => {
    it('should response with a 200 status code', async () => {
      const res = await getExercise(user._id)
      expect(res.status).toBe(200)
    })
    it('response should contain id', async () => {
      const res = await getExercise(user._id)
      expect(res.body._id).toBeDefined()
      expect(res.body._id).toEqual(expect.any(String))
    })
    it('response should contain username', async () => {
      const res = await getExercise(user._id)
      expect(res.body.username).toBeDefined()
      expect(res.body.username).toEqual(user.username)
    })
    it('response should contain count', async () => {
      await postExercise(user._id)
      const res = await getExercise(user._id)
      expect(res.body.count).toBeDefined()
      expect(res.body.count).toEqual(1)

      await postExercise(user._id)
      const res2 = await getExercise(user._id)
      expect(res2.body.count).toEqual(2)
    })
    it('response should contain log', async () => {
      await postExercise(user._id)
      const res = await getExercise(user._id)

      expect(res.body.log).toBeDefined()
      expect(res.body.log.length).toEqual(1)
    })
  })

  describe('Given a limit', () => {
    it('should return the limit amounted of logs', async () => {
      await postExercise(user._id)
      await postExercise(user._id)
      await postExercise(user._id)
      const res = await request(app).get(`/api/users/${user._id}/logs?limit=2`)

      expect(res.body.log).toBeDefined()
      expect(res.body.log.length).toEqual(2)
    })
  })
  describe('Filter by date', () => {
    describe('Given a start or fom date', () => {
      it('should filters the logs', async () => {
        await postExercise(user._id)
        await postExercise(user._id, { ...validExercise, date: '2000-07-21' })
        const res = await request(app).get(`/api/users/${user._id}/logs?from=2000-07-20`)
        expect(res.body.log.length).toEqual(1)
      })
    })
  })

  describe('Given a invalid user ID', () => {
    it('should return a 404 error', async () => {
      const res = await getExercise('abc')
      expect(res.status).toBe(404)
    })
  })
})
