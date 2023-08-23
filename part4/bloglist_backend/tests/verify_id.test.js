const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('Blog object has "id" field', async () => {
  // Save a sample blog to the testing database
  const sampleBlog = new Blog({
    title: 'Id Test Blog Title',
    author: 'Id Test Blog Author',
    url: 'Id Test Blog Url',
    likes: 1
  })
  const savedBlog = await sampleBlog.save()

  // Check that returned object has "id" field
  expect(savedBlog.id).toBeDefined()
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})