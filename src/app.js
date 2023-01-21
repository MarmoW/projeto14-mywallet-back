import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import dayjs from "dayjs"
import joi from "joi"
import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db
await mongoClient.connect()
db = mongoClient.db()

const server = express()
server.use(express.json())
server.use(cors())


server.post("/", async (req,res) => {
    const {email, password} = req.body
    const signInSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const {error} = signInSchema.validate({email, password})
    if(error) return res.status(422).send(error)

    try{
        const verifyUser = await db.collection("users").findOne({email: email})
        const passwordCheck = bcrypt.compareSync(password, verifyUser.password)

        if(!verifyUser) return res.status(400).send("Usuário ou senha incorretos")
        console.log(!verifyUser)
        if(!passwordCheck) return res.status(400).send("Usuário ou senha incorretos")

        const rightPassword = bcrypt.compareSync(password, verifyUser.password)

        if(!rightPassword) return res.status(400).send("Usuário ou senha incorretos")
        const authToken = uuidV4()

        await db.collection("sections").insertOne({ idUsuario: verifyUser._id, authToken })
        
        return res.status(200).send(authToken)

    }catch(err){
        res.status(500).send(err.mensage)
    }
})
 
server.post("/cadastro", async (req, res) => {
    const {user, email, password, confirmPassword} = req.body

    const passwordHashed = bcrypt.hashSync(password, 10)
    const signUpSchema = joi.object({
        user: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().valid(joi.ref("password")).required()
    })

    const {error} = signUpSchema.validate({user, email, password, confirmPassword})
    if(error) return res.status(401).send(error.message)

    const checkUser = await db.collection("users").findOne({user: user})
    console.log(checkUser)

    if(checkUser) return res.status(400).send("Tente outro nome de usuário ou email")
    

    try{
        await db.collection("users").insertOne({user, email, password: passwordHashed})
        res.status(200).send("Cadastro efetuado com sucesso.")

    }catch(err){
        res.status(500).send(err)
    }

})

server.get("/home", async (req,res) => {
    const {authtoken}  = req.headers

    const findToken = await db.collection("sections").findOne({authToken: authtoken})

    if(!findToken) return res.status(400).send("Por favor retorne a página de login")

    console.log(findToken.idUsuario)

    
    try{
        const registerWallet = await db.collection("wallet").find({idUsuario: findToken.idUsuario}).toArray()
        console.log(registerWallet)
        res.status(200).send(registerWallet)

    }catch(err){
        res.status(500).send(err)
    }
})

server.post("/nova-entrada", async (req, res) => {
    const {value, description} = req.body
    const {authtoken} = req.headers
    const entrySchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    })
    
    const findToken = await db.collection("sections").findOne({authToken: authtoken})
    if(!findToken) return res.status(400).send("Faça login novamente")
    
    const {error} = entrySchema.validate({value, description})
    if(error) return res.status(400).send(error.message)
    
    try{
        await db.collection("wallet").insertOne({idUsuario: findToken.idUsuario, name: description, value: value, data: dayjs().format("DD/MM"), op: "entry"})
        res.status(200).send("Cadastrado com sucesso")
    }catch(err){
        res.status(500).send(err)
    }

})

server.post("/nova-saida", async (req, res) => {
    const {value, description} = req.body
    const {authtoken} = req.headers
    const drawSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    })
    
    const findToken = await db.collection("sections").findOne({authToken: authtoken})
    if(!findToken) return res.status(400).send("Faça login novamente")

    const {error} = drawSchema.validate({value, description})
    if(error) return res.status(400).send(error.message)

    try{
        await db.collection("wallet").insertOne({idUsuario: findToken.idUsuario, name: description, value: value, data: dayjs().format("DD/MM"), op: "draw"})
        res.status(200).send("Cadastrado com sucesso")
    }catch(err){
        res.status(500).send(err)
    }
})

server.listen(5000, () => {
    console.log('Server on')
  })