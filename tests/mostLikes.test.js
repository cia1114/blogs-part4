const { describe, test } = require('node:test')
const assert = require('node:assert')
const logger = require('../utils/logger')

const mostLikes = require('../utils/list_helper').mostLikes

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


describe('mostLikes', () => {
  logger.info('mostLikes', mostLikes(blogs))
  test('returns the author with the most likes', () => {
    assert.deepStrictEqual(mostLikes(blogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('returns undefined when there are no blogs', () => {
    assert.deepStrictEqual(mostLikes([]), undefined)
  })

  test('returns the author with the most likes when there are multiple authors with the same number of likes', () => {
    const authorsWithSameLikes = [
      ...blogs,
      {
        title: 'another blog',
        author: 'Robert C. Martin',
        likes: 5
      }
    ]
    assert.deepStrictEqual(mostLikes(authorsWithSameLikes), {
      author: 'Robert C. Martin',
      likes: 17
    })
  })

  test('returns author of the first blog when the list has only one blog', () => {
    const oneBlog = [blogs[0]]
    assert.deepStrictEqual(mostLikes(oneBlog), {
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('returns undefined when all blogs in the list has no likes or negative likes', () => {
    assert.deepStrictEqual(mostLikes([
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