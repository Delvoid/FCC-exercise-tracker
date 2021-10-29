const request = require('supertest')
const app = require('../app')
const { createUser } = require('../service/userService')
const UserModel = require('../models/UserModel')
const connectDb = require('../utils/connectDb')

let dbConnection

const userStub = {
  username: 'Delvoid',
}

beforeAll(async () => {
  dbConnection = await connectDb()
})

afterAll(async () => {
  await dbConnection.collection('users').deleteMany({})
  await dbConnection.close()
})
beforeEach(async () => {
  await dbConnection.collection('users').deleteMany({})
})

const addUser = async (username = 'Test') => {
  const agent = await request(app).post('/api/users').send({
    username: username,
  })
  return agent
}

describe('Create User', () => {
  describe('Given a valid username', () => {
    it('should save the user to the database', async () => {
      const user = await createUser(userStub.username)
      expect(user.username).toEqual(userStub.username)
    })
    it('should not create duplicate users', async () => {
      await createUser(userStub.username)
      await createUser(userStub.username)
      const users = await UserModel.find({ username: userStub.username })
      expect(users.length).toBe(1)
    })
    it('should conatin username and logs', async () => {
      await createUser(userStub.username)
      const users = await UserModel.find({ username: userStub.username })
      expect(users[0].username).toBeDefined()
      expect(users[0].logs).toBeDefined()
    })
  })
})

describe('POST /users', () => {
  describe('given a username', () => {
    it('should respond with a 200 status code', async () => {
      const res = await addUser()
      expect(res.statusCode).toBe(200)
    })
    it('should specify json in the content type header', async () => {
      const res = await addUser()
      expect(res.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
    test('response should contain _id and be a string', async () => {
      const res = await addUser()
      expect(res.body._id).toBeDefined()
      expect(res.body._id).toEqual(expect.any(String))
    })
    test('response should contain username', async () => {
      const res = await addUser()
      expect(res.body.username).toBeDefined()
    })
    it('should save the user to the database', async () => {
      const res = await addUser(userStub.username)
      expect(res.body.username).toEqual(userStub.username)
    })
    it('should not create duplicate users ', async () => {
      await addUser(userStub.username)
      await addUser(userStub.username)
      const users = await UserModel.find({ username: userStub.username })

      expect(users.length).toBe(1)
    })
    it('should return error, username and id on duplicated users', async () => {
      const res = await addUser(userStub.username)
      const res2 = await addUser(userStub.username)
      expect(res.body.username).toEqual(userStub.username)
      expect(res2.status).toBe(400)
      expect(res2.body._id).toBeDefined()
      expect(res2.body.username).toBeDefined()
    })
  })

  describe('when username is missing', () => {
    it('should respond with a status code of 400', async () => {
      const res = await request(app).post('/api/users').send({})
      expect(res.statusCode).toBe(400)
    })
  })
})
