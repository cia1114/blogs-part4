const { test, describe } = require('node:test')
const assert = require('node:assert')

const favoriteBlog = require('../utils/list_helper').favoriteBlog

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2
  }
]

describe('favoriteBlog', () => {

  test('returns the blog with the most likes', () => {
    assert.deepStrictEqual(favoriteBlog(blogs), {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

  test('returns the blog with the most likes when there are multiple blogs with the same number of likes', () => {
    const blogsWithSameLikes = [
      ...blogs,
      {
        title: 'Another blog',
        author: 'John Doe',
        likes: 12
      }
    ]
    assert.deepStrictEqual(favoriteBlog(blogsWithSameLikes), {
      title: 'Another blog',
      author: 'John Doe',
      likes: 12
    })
  })

  test('returns undefined when the list is empty', () => {
    assert.deepStrictEqual(favoriteBlog([]), undefined)
  })

  test('returns first blog when the list has only one blog', () => {
    assert.deepStrictEqual(favoriteBlog([{
      title: 'Single blog',
      author: 'John Doe',
      likes: 5
    }]), {
      title: 'Single blog',
      author: 'John Doe',
      likes: 5
    })
  })

  test('returns undefined when all blogs in the list has no likes or negative likes', () => {
    assert.deepStrictEqual(favoriteBlog([
      {
        title: 'Single blog',
        author: 'John Doe',
        likes: -5
      },
      {
        title: 'Blog with negative likes',
        author: 'Jane Doe',
        likes: 0
      }
    ]), undefined)
  })

})

