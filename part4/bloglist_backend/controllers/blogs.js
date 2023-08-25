const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  // Check if the user field exists
  if (blogs.user) {
    blogs = await Blog.find({}).populate('user', 'username name')
  }

  const prettyBlogs = JSON.stringify(blogs, null, 2)
  response.type('application/json').send(prettyBlogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (request.body.user) {
    const user = await User.findById(request.body.user.id);
  }

  const savedBlog = await blog.save()

  if (request.body.user) {
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  }

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const blogId = request.params.id
  const updatedBlogData = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, { new: true })

  if (request.body.user && request.body.user.id) {
    const user = await User.findById(request.body.user.id)
    user.blogs = user.blogs.concat(updatedBlog._id)
    await user.save()
  }

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id

  await Blog.findByIdAndDelete(blogId)
  response.status(204).end()
})

module.exports = blogsRouter