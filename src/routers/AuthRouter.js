import { SignIn, SignUp, EntryList } from "../controllers/Auth.js"
import { Router } from 'express'
import { ValidateSchema } from "../middlewares/ValidateMiddleware.js"
import { signInSchema, signUpSchema } from '../schema/Auth.js'

const authRouter = Router()

authRouter.post("/cadastro", ValidateSchema(signInSchema), SignUp)
authRouter.post("/", ValidateSchema(signUpSchema), SignIn)


export default authRouter