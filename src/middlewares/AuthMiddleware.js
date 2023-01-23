import db from "../config/database.js"

export async function authValidation(req, res, next){
    
    try{
        const {authtoken, user} = req.headers

        console.log(req.headers, "aqui")

        if(!authtoken) return res.status(422).send("Token não informado")

        const findToken = await db.collection("sections").findOne({authToken: authtoken})

        if(!findToken) return res.status(400).send("Por favor retorne a página de login")

        res.locals.sessao = findToken
        
        next()

    }catch(err){
        res.status(500).send(err)
    }
} 