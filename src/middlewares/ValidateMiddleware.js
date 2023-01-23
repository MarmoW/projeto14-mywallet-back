export default function ValidateSchema(schema) {
    return (req, res, next) => {
      const {error} = schema.validate(req.body, { abortEarly: false })
      
      console.log(req.body, "opa")
      console.log(error)
      if (error) {
        const errMessage = error.details.map(err => err.message)
        return res.status(422).send(errMessage)
      }
      
      next()
    }
  }