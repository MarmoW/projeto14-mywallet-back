import { entrySchema } from '../schema/AddEntry.js'
import db from '../config/database.js'
import dayjs from "dayjs"

export async function PositiveEntry(req, res){
    const {description, value} = req.body
    const findToken = res.locals.sessao
    console.log(findToken)

    try{
        await db.collection("wallet").insertOne({idUsuario: findToken.idUsuario, name: description, value: value, data: dayjs().format("DD/MM"), op: "entry"})
        res.status(200).send("Cadastrado com sucesso")
    }catch(err){
        res.status(500).send(err)
    }
    }

export async function NegativeEntry(req, res){  
    const {description, value} = req.body
    const findToken = res.locals.sessao
    console.log(findToken)

    try{
        await db.collection("wallet").insertOne({idUsuario: findToken.idUsuario, name: description, value: value, data: dayjs().format("DD/MM"), op: "draw"})
        res.status(200).send("Cadastrado com sucesso")
    }catch(err){
        res.status(500).send(err)
    }
    }