const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('"likes" field defaults to 0', async () => {
  // Save a sample blog to the testing database
  const sampleBlog = new Blog({
    title: 'Likes Test Blog Title',
    author: 'Likes Test Blog Author',
    url: 'Likes Test Blog Url'
  })
  const savedBlog = await sampleBlog.save()

  // Check that returned object's "likes" field is 0
  expect(savedBlog.likes).toEqual(0)
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})