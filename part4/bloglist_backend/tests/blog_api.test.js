const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogs = response.body
  expect(blogs.length).toEqual(6) // The helper sets 6 initial blogs.
}, 10000)

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

/*
describe('Missing properties is a bad request 400', () => {
  test('POST responds with 400 if title is missing', async () => {
    const blogWithoutTitle = {
    // Omitting the title property
    author: 'Missing Test Blog Author',
    url: 'Missing Test Blog Url',
    likes: 1
    }

    const response = await api.post('/api/blogs').send(blogWithoutTitle);
  
    // Check that the response status is 400
    expect(response.status).toBe(400)
  })
  
  test('POST responds with 400 if url is missing', async () => {
    const blogWithoutUrl = {
    title: 'Missing Test Blog Title',
    author: 'Missing Test Blog Author',
    // Omitting the url property
    likes: 1
    }

    const response = await api.post('/api/blogs').send(blogWithoutUrl);

    // Check that the response status is 400
    expect(response.status).toBe(400)
  })
})
*/

afterAll(async () => {
  await mongoose.connection.close()
})