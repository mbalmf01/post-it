const {authDeny} = require('./messages')
const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send({'Host message':authDeny})
    }
    try{
        const verified = jsonwebtoken.verify(token,process.env.TOKEN_SECRET)
        req.user=verified
        next()
    }catch(err){
        return res.status(401).send({'Host message':authDeny})
    }
}

module.exports=auth