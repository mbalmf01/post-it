const express = require('express')
const bcryptjs = require('bcryptjs')
const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')
const { json } = require('body-parser')
const {welcome,registered} = require('../messages')

router.post('/register', async(req,res)=>{

    // Validation 1 to check user input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    //Validation 2 - check if user exists
    const userExists = await User.findOne({email:req.body.email})
    if(userExists){
        return res.status(400).send({message:'User already exists'})
    }

    //I created a hashed representation of my password using salt
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    //code to insert user
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({"Host message":registered, "Login details":savedUser})
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.post('/login', async(req,res)=>{
        // Validation 1 to check user input
        const {error} = loginValidation(req.body)
        if(error){
            return res.status(400).send({message:error['details'][0]['message']})
        }
    
        //Validation 2 to check user email
        const userLogin = await User.findOne({email:req.body.email})
        if(!userLogin){
            return res.status(400).send({message:'User does not exist'})
        }

        //Validation 3 to check user password
        const passwordValidation = await bcryptjs.compare(req.body.password, userLogin.password)
        if(!passwordValidation){
            return res.status(400).send({message:"Password is incorrect"})
        }
        //generate an auth-token
        const token = jsonwebtoken.sign({_id:userLogin._id}, process.env.TOKEN_SECRET)
        res.header('auth-token',token).send({"Host message":welcome, 'auth-token':token})
})



module.exports=router