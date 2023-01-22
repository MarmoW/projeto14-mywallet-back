import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db


try{
await mongoClient.connect()
db = mongoClient.db()
}
catch(err){
    console.log("Deu bom não", err)
}

export default db