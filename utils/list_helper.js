const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  if (blogs.every(blog => blog.likes <= 0)) {
    return undefined
  }
  return blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const authors =  blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})
  const mostBlogsAuthor = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
  return {
    author: mostBlogsAuthor,
    blogs: authors[mostBlogsAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }

  const authors = blogs.reduce( (alc, blog) => {
    alc[blog.author] = (alc[blog.author] || 0) + blog.likes
    return alc
  }, {})
  if (Object.values(authors).every(value => value <= 0)) {
    return undefined
  }
  const mostLikesAuthor = Object.keys(authors).reduce((a, b) => authors[a] > authors[b] ? a : b)
  return {
    author: mostLikesAuthor,
    likes: authors[mostLikesAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}