const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Test Blog 1',
    author: 'Juan',
    url: 'http://testblog1.com',
    likes: 0
  },
  {
    title: 'Test Blog 2',
    author: 'Pedro',
    url: 'http://testblog2.com',
    likes: 5
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb
}