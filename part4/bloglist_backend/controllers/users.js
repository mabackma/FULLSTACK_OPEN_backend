const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', 'url title author id')
  
  const UsersWithoutPassword = users.map(user => ({
    // rearrange order for displaying
    blogs: user.blogs.map(blog => ({
      url: blog.url,
      title: blog.title,
      author: blog.author,
      id: blog.id
    })),
    username: user.username,
    name: user.name,
    id: user.id
  }))
  
  const prettyUsersWithoutPassword = JSON.stringify(UsersWithoutPassword, null, 2)
  response.type('application/json').send(prettyUsersWithoutPassword)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Both username and password must be at least 3 characters long.' });
  }

  // Check if username is unique
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'Username must be unique.' })
  }

  const saltRounds = 10
  const passwordHash = await bcryptjs.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    password: passwordHash,
    blogs: request.body.blogs
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter