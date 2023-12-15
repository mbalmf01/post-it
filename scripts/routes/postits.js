const express = require('express')
const router = express.Router()
const verifyToken = require('../verifyToken')
const {
        postitMessage,postedData,commentPosted,likePosted,
        selfLike,checkOwner,idExists,uniqueTitle,selfComment
    } = require('../messages')
const {postitValidation,commentValidation} = require('../validations/validation')

const Postit = require('../models/Postit')
const User = require('../models/User')

//GET 1 - Get all post-its
router.get('/', verifyToken, async(req,res) =>{
    try{
        const postits = await Postit.find().sort({ "likes": -1, "date": 1 })
        res.send({"Host message":postitMessage, "Post-Its":postits})
    }catch(err){
        res.status(400).send({message:err})
    }
})

//GET 2 - Get post-its from a specific user by userId (issued on login)
router.get('/:ownerId', verifyToken, async(req,res) =>{
    try{
        const ownerId = await User.findOne({_id:req.params.ownerId})
        const postsByOwner = await Postit.find({owner:ownerId.username})
        res.send({"Host message":postitMessage, "Post-Its":postsByOwner})
    }catch(err){
        res.status(400).send({message:err})
    }
})

//POST 1 - Post a post-it onto the pile
router.post('/', verifyToken, async(req,res)=>{
    // Validation 1 to check input
    const {error} = postitValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    //Validation 2 to check title doesn't already exist
    const userPost = await Postit.findOne({title:req.body.title})
    if(userPost){
        return res.status(400).send({"Host message":uniqueTitle})
    }
    
    //Validation 3 to check if the postit owner is in the User database
    const owner = await User.findOne({username:req.body.owner})
    if(!owner){
        return res.status(400).send({"Host message":checkOwner})
    }

    const postData = new Postit({
        owner:req.body.owner,
        title:req.body.title,
        content:req.body.content
    })
    try{
        const postToSave = await postData.save()
        res.send({"Host message":postedData, "Your post-it":postToSave})
    }catch(err){res.send({message:err})}
})

//PATCH 1 - Like a post-it
router.patch('/likes', verifyToken, async(req,res)=>{
    //Validation 1 - is owner in the user database?
    const owner = await User.findOne({username:req.body.owner})
    if(!owner){
        return res.status(400).send({"Host message":checkOwner})
    }
    //Validation 2 - is ID correct
    const postitIdExists = await Postit.findOne({_id:req.body.postitId})
    if(!postitIdExists){
        return res.status(400).send({"Host message":idExists})
    }
    //Validation 3 - is user liking own postit?
    const sameUser = await Postit.findOne({_id:req.body.postitId})
    if(sameUser.owner===req.body.owner){
        return res.status(400).send({"Host message":selfLike})
    }
    try{
        const likeById = await Postit.findByIdAndUpdate({_id:req.body.postitId}, {$inc:{'likes':1}})
        const likedPost = await Postit.findOne({_id:req.body.postitId})
        res.send({"Host message":likePosted, "Post-Its":likedPost})
    }catch(err){
        res.status(400).send({message:err})
    }
})

//PATCH 2 - Comment on a post
router.patch('/comments', verifyToken, async(req,res)=>{
    //Validation 1 - is owner in the user database?
    const commentOwner = await User.findOne({username:req.body.owner})
    if(!commentOwner){
        return res.status(400).send({"Host message":checkOwner})
    }
    //Validation 2 - is user commenting on own postit?
    const postit = await Postit.findOne({_id:req.body.postitId})
    if(postit.owner===req.body.owner){
        return res.status(400).send({"Host message":selfComment})
    }
    // Validation 3 to check input against validation
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }
    try{
        const commentById = await Postit.findByIdAndUpdate({_id:req.body.postitId}, {$push:{comments:{owner:req.body.owner, content:req.body.content}}})
        const postit = await Postit.findById({_id:req.body.postitId})
        res.send({"Host message":commentPosted, "Post-Its":postit})
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router