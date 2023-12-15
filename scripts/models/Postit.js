const mongoose = require('mongoose')
const commentSchema = mongoose.Schema({
    owner:{type:String}, content:{type:String}, date:{type:Date, default:Date.now}
})

const postitSchema = mongoose.Schema({
    title:{type:String, require:true},
    date:{type:Date, default:Date.now,},
    owner:{type:String, require:true},
    content:{type:String, require:true},
    likes:{type:Number, default:0},
    comments:[commentSchema]
})

module.exports = mongoose.model('postits', postitSchema)