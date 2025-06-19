const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({ ...body, user: user.id })
  const result = await blog.save()

  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  const idBlog = request.params.id
  const user = request.user

  const blog = await Blog.findById(idBlog)

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(idBlog)
    response.status(204).end()
  }

  response.status(400).json({ error: 'You do not have permission for this operation' })
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
    new: true,
    runValidators: true,
    context: 'query'
  })
  response.json(updatedBlog)
})

module.exports = blogRouter
