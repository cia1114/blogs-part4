/* eslint-disable @stylistic/js/indent */
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')


const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })
    const rootUser = await user.save()

  await Blog.deleteMany({})
    //await Blog.insertMany(helper.initialBlogs)
    // Insert blogs with the user reference
    await Blog.insertMany(helper.initialBlogs.map(blog => { return { ...blog, user: rootUser._id } }))
    /*
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray) */
  })

  test('all blogs are return', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('identifier property of the blog posts is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.notStrictEqual(response.body[0].id, undefined)
  })

  describe('addition of a new blog', () => {
    test('if no token, it will return 401 Unauthorized', async () => {
      const newBlog = {
        title: 'Test Blog 4',
        author: 'Ana',
        url: 'http://testblog4.com',
        likes: 5
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
     })

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Test Blog 3',
        author: 'Maria',
        url: 'http://testblog3.com',
        likes: 10
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getToken('root', 'sekret')}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      assert.strictEqual(blogsAtEnd[helper.initialBlogs.length].title, newBlog.title)
    })

    test('if likes property is missing, it will default to 0', async () => {
      const newBlog = {
        title: 'Test Blog 4',
        author: 'Ana',
        url: 'http://testblog4.com'
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getToken('root', 'sekret')}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd[helper.initialBlogs.length].likes, 0)
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
        .set('Authorization', `Bearer ${await helper.getToken('root', 'sekret')}`)
        .send(blogWithoutTitle)
        .expect(400)
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${await helper.getToken('root', 'sekret')}`)
        .send(blogWithoutUrl)
        .expect(400)
      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
  describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
      const blogsAtFirst = await helper.blogsInDb()
      const blogToDelete = blogsAtFirst[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${await helper.getToken('root', 'sekret')}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map( blog => blog.title)
      assert(!contents.includes(blogToDelete.title))
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '67876'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${await helper.getToken('root', 'sekret')}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
     })
    })

    describe('updating a blog', () => {
      test('a blog can be updated', async () => {
        const blogsAtFirst = await helper.blogsInDb()
        const blogToUpdate = { ...blogsAtFirst[0], likes: 10 }

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(blogToUpdate)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.deepStrictEqual(blogsAtEnd[0], blogToUpdate)
      })
    })
})

after(async () => {
  await mongoose.connection.close()
})


