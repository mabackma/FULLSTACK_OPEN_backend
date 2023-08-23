const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('blogs are saved with POST', async () => {
  const initialResponse = await api.get('/api/blogs').expect(200)
  const initialBlogs = initialResponse.body

  // Save a sample blog to the testing database
  const sampleBlog = new Blog({
      title: 'POST Test Blog Title',
      author: 'POST Test Blog Author',
      url: 'POST Test Blog Url',
      likes: 1
    })
  await sampleBlog.save()
  
  const currentResponse = await api.get('/api/blogs').expect(200)
  const currentBlogs = currentResponse.body

  // Compare the amount of initial blogs to the amount of current blog and make sure one was added
  expect(currentBlogs.length).toEqual(initialBlogs.length + 1)
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})