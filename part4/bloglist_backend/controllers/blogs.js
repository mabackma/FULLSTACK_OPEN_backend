const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).find({}).populate('user', 'username name')

  const prettyBlogs = JSON.stringify(blogs, null, 2)
  response.type('application/json').send(prettyBlogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  
  // Verify token
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const userObj = await User.findById(decodedToken.id)
  const user = request.user   // This uses the middleware to get the id for user

  // Make blog's userfield, the current user.
  blog.user = user

  // Save blog
  const savedBlog = await blog.save()

  // Update user's blog list
  if (userObj) {
    userObj.blogs = userObj.blogs.concat(savedBlog._id)
    await userObj.save()
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
  const blog = await Blog.findById(blogId)
  
  //const decodedToken = jwt.verify(request.token, process.env.SECRET)
  //if (blog.user.toString() === decodedToken.id) {
  if (blog.user.toString() === request.user.toString()) {
    await Blog.findByIdAndDelete(blogId)
  }
  response.status(204).end()
})

module.exports = blogsRouter