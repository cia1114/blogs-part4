const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }
  next(err)
}

module.exports = {
  errorHandler
}