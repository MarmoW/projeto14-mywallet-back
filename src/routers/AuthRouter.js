import { SignIn, SignUp } from "../controllers/Auth.js"
import { Router } from 'express'
import ValidateSchema from "../middlewares/ValidateMiddleware.js"
import { signInSchema, signUpSchema } from '../schema/Auth.js'

const authRouter = Router()

authRouter.post("/cadastro", ValidateSchema(signUpSchema), SignUp)
authRouter.post("/", ValidateSchema(signInSchema), SignIn)
 

export default authRouter