
import { NegativeEntry, PositiveEntry} from "../controllers/Entry.js"
import { Router } from 'express'
import { authValidation } from "../middlewares/AuthMiddleware.js"
import { entrySchema } from '../schema/AddEntry.js'
import ValidateSchema from "../middlewares/ValidateMiddleware.js"
import { EntryList } from "../controllers/Auth.js"
  
const EntryRouter = Router()
  
EntryRouter.use(authValidation)
EntryRouter.post("/nova-entrada", ValidateSchema(entrySchema), PositiveEntry)
EntryRouter.post("/nova-saida", ValidateSchema(entrySchema), NegativeEntry)
EntryRouter.get("/home", EntryList)
    
export default EntryRouter