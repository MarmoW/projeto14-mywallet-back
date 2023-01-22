export function ValidateSchema(schema) {
    return (req, res, next) => {
      const { err } = schema
        .validate(req.body,
          { abortEarly: false })
  
      if (err) {
        const errMessage = err.details.map(err => err.message)
        return res.status(422).send(errMessage)
      }
      next()
    }
  }