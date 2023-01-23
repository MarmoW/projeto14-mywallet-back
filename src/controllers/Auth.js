import bcrypt from 'bcrypt'
import { v4 as uuidV4 } from 'uuid'
import db from "../config/database.js"
import {signUpSchema, signInSchema} from "../schema/Auth.js"


export async function SignIn(req,res) {
    const {email, password} =  req.body

    try{
        const verifyUser = await db.collection("users").findOne({email: email})

        if(!verifyUser) return res.status(400).send("Usuário ou senha incorretos")
        
        const passwordCheck = bcrypt.compareSync(password, verifyUser.password)

        if(!passwordCheck) return res.status(400).send("Usuário ou senha incorretos")

        const authToken = uuidV4()

        await db.collection("sections").insertOne({ idUsuario: verifyUser._id, authToken: authToken })

        res.status(200).send({authtoken: authToken, user: verifyUser.user})

    }catch(error){

        res.status(500).send(error.message)

    }
}

export async function SignUp(req, res){
    const {user, email, password, confirmPassword} = req.body

    const passwordHashed = bcrypt.hashSync(password, 10)
   
    const checkUser = await db.collection("users").findOne({user: user})
    
    if(checkUser) return res.status(400).send("Tente outro nome de usuário ou email")
    
    try{
        await db.collection("users").insertOne({user, email, password: passwordHashed})
        res.status(200).send("Cadastro efetuado com sucesso.")

    }catch(error){
        res.status(500).send(error.message)
    }

}

export async function EntryList(req, res) {
    const findToken = res.locals.sessao
    console.log(findToken)
    try{
        const registerWallet = await db.collection("wallet").find({idUsuario: findToken.idUsuario}).toArray()
        console.log(registerWallet)
        res.status(200).send(registerWallet)
    }catch(error){
        res.status(500).send(error.message)
    }
    }