const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const myApi = supertest(app)

describe('Missing properties is a bad request 400', () => {
  test('POST responds with 400 if title is missing', async () => {
    const blogWithoutTitle = {
    // Omitting the title property
    author: 'Missing Test Blog Author',
    url: 'Missing Test Blog Url',
    likes: 1
    }

    const response = await myApi.post('/api/blogs').send(blogWithoutTitle);
  
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

    const response = await myApi.post('/api/blogs').send(blogWithoutUrl);

    // Check that the response status is 400
    expect(response.status).toBe(400)
  })
})