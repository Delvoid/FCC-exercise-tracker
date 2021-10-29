const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    // duration must be given
    body('duration').isInt().withMessage('Invalid Duration'),
    body('description').notEmpty().withMessage('Please provide a description'),
    body('date').optional({ checkFalsy: true }).isDate(),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  // const extractedErrors = []
  // errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }))
  validationErrors = {}
  errors.array().forEach((error) => (validationErrors[error.param] = error.msg))

  return res.status(422).json({
    errors: validationErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}
