const info = (...args) => {
  console.log(...args)
}

const error = (...args) => {
  console.error(...args)
}

const logger = {
  info,
  error
}

module.exports = logger