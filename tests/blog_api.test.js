const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, blogsInDb } = require('./test_helper')


const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('all blogs are return', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('identifier property of the blog posts is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.notStrictEqual(response.body[0].id, undefined)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog 3',
    Author: 'Maria',
    url: 'http://testblog3.com',
    likes: 10
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
  assert.strictEqual(blogsAtEnd[initialBlogs.length].title, newBlog.title)
})

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: 'Test Blog 4',
    author: 'Ana',
    url: 'http://testblog4.com'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd[initialBlogs.length].likes, 0)
})

test('blog without title and url is not added', async () => {
  const blogWithoutTitle = {
    author: 'Juan',
    url: 'http://testblog5.com'
  }
  const blogWithoutUrl = {
    title: 'Test Blog 5',
    author: 'Juan'
  }
  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})


