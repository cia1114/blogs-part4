const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  next(err)
}


module.exports = {
  errorHandler
}