const mongoose = require('mongoose')
const supertest = require('supertest')
const bcryptjs = require('bcryptjs')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  // Create a new user for testing
  await User.deleteMany({});
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    password: await bcryptjs.hash('testpassword', 10), // Hash the password
  });
  await user.save()

  // Authenticate the test user and get the JWT token
  const response = await api.post('/api/login').send({
    username: 'testuser',
    password: 'testpassword',
  })
  api.token = response.body.token
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `Bearer ${api.token}`) // Include the token in the request header
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogs = response.body
  expect(blogs.length).toEqual(6) // The helper sets 6 initial blogs.
}, 10000)

test('Blog object has "id" field', async () => {
  // Save a new blog to the testing database
  const newBlog = new Blog({
    title: 'Id Test Blog Title',
    author: 'Id Test Blog Author',
    user: '64e9468a989724eaae547364',   // a valid user ObjectId in testing database
    url: 'Id Test Blog Url',
    likes: 1
  })
  
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${api.token}`) // Include the token in the request header
    .send(newBlog.toJSON())
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Check that returned object has "id" field
  expect(response.body.id).toBeDefined()
}, 10000)

test('blogs are saved with POST', async () => {

  // Save a new blog to the testing database
  const newBlog = new Blog({
    title: 'POST Test Blog Title',
    author: 'POST Test Blog Author',
    url: 'POST Test Blog Url',
    likes: 1
  })
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${api.token}`) // Include the token in the request header
    .send(newBlog.toJSON())
    .expect(201)
    .expect('Content-Type', /application\/json/)
    
  const blogsAtEnd = await helper.blogsInDb()

  // Compare the amount of initial blogs to the amount of current blogs and make sure one was added
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContain(
    'POST Test Blog Title'
  )
}, 10000)

test('"likes" field defaults to 0', async () => {
  // Save a new blog to the testing database
  const newBlog = new Blog({
    title: 'Likes Test Blog Title',
    author: 'Likes Test Blog Author',
    url: 'Likes Test Blog Url'
  })
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${api.token}`) // Include the token in the request header
    .send(newBlog.toJSON())
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Check that returned object's "likes" field is 0
  expect(response.body.likes).toEqual(0)
}, 10000)

test('fails with status code 400 if url is missing', async () => {
  const blogWithoutUrl = {
    title: "blog is missing url"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${api.token}`) // Include the token in the request header
    .send(blogWithoutUrl)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  // Make sure no blogs were added
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('fails with status code 400 if title is missing', async () => {
  const blogWithoutTitle = {
    url: "blog is missing title"
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${api.token}`) // Include the token in the request header
    .send(blogWithoutTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  // Make sure no blogs were added
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})