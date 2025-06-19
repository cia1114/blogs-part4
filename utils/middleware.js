const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  } else if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error'))
    return res.status(400).json({ error: 'expected `username` to be unique' })
  next(err)
}

const tokenExtractor = (req, res, next) => {
  // código que extrae el token
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer')) {
    req.token = authorization.replace('Bearer ', '')
  }
  //return null

  next()
}


module.exports = {
  errorHandler,
  tokenExtractor
}