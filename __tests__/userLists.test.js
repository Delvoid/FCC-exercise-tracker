const request = require('supertest')
const app = require('../app')
const { createUser } = require('../service/userService')
const UserModel = require('../models/UserModel')
const connectDb = require('../utils/connectDb')

let dbConnection

beforeAll(async () => {
  dbConnection = await connectDb()
})

afterAll(async () => {
  await dbConnection.collection('users').deleteMany({})
  await dbConnection.close()
})
beforeEach(async () => {
  await dbConnection.collection('users').deleteMany({})
  await makeUsers()
})

const makeUsers = async (count = 5, username = 'Delvoid') => {
  for (let i = 0; i < count; i++) {
    await createUser(`${username}${i}`)
  }
}

const getUsers = async () => {
  const agent = await request(app).get('/api/users')
  return agent
}

describe('GET /api/users', () => {
  it('should respond with a 200 status code', async () => {
    const res = await getUsers()
    expect(res.statusCode).toBe(200)
  })
  it('should respond with a list of users ', async () => {
    const res = await getUsers()
    expect(res.body.length).toBe(5)
  })
})
