const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('Invalid user creation returns error messages and status codes', async () => {
  const invalidUser1 = {
    username: 'us',
    password: 'pw'
  }

  const invalidUser2 = {
    username: '',
    password: 'pass'
  }

  const existingUser = {
    username: 'hellas',
    password: 'password'
  }

  // Create an existing user to test uniqueness
  await api.post('/api/users').send(existingUser)

  const response1 = await api.post('/api/users').send(invalidUser1)
  const response2 = await api.post('/api/users').send(invalidUser2)
  const response3 = await api.post('/api/users').send(existingUser)

  expect(response1.status).toBe(400)
  expect(response1.body.error).toContain('must be at least 3 characters long')

  expect(response2.status).toBe(400)
  expect(response2.body.error).toContain('must be at least 3 characters long')

  expect(response3.status).toBe(400)
  expect(response3.body.error).toContain('must be unique')
})

afterAll(async () => {
  await mongoose.connection.close()
})