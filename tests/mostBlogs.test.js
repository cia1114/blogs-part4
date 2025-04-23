const { describe, test } = require('node:test')
const  assert  = require('node:assert')
const logger = require('../utils/logger')

const mostBlogs = require('../utils/list_helper').mostBlogs

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

describe('mostBlogs', () => {

  test('returns the author with the most blogs', () => {
    logger.info('mostBlogs', mostBlogs(blogs))
    assert.deepStrictEqual( mostBlogs(blogs), {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('returns undefined when there are no blogs', () => {
    assert.deepStrictEqual(mostBlogs([]), undefined)
  })

  test('returns the author with the most blogs when there are multiple authors with the same number of blogs', () => {
    const blogsWithSameBlogs = [
      ...blogs,
      {
        title: 'another blog',
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    ]
    assert.deepStrictEqual(mostBlogs(blogsWithSameBlogs), {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('returns first author when the list has only one blog', () => {
    assert.deepStrictEqual(mostBlogs([
      {
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7
      }
    ]), {
      author: 'Michael Chan',
      blogs: 1
    })
  })

})
