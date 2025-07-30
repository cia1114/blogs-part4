const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
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

const userExtractor = async (req, res, next) => {
  if(!req.token) {
    return res.status(401).json({ error: 'token is missing' })
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET)

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  req.user = user

  next()
}


module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}