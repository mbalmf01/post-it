const joi = require('joi')


const registerValidation = (data) =>{
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(100),
        email:joi.string().required().email().min(6).max(256),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) =>{
    const schemaValidation = joi.object({
        email:joi.string().required().email().min(6).max(256),
        password:joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const postitValidation = (data) =>{
    const schemaValidation = joi.object({
        owner:joi.string().required().min(3).max(100),
        title:joi.string().required().min(3).max(20),
        content:joi.string().required().min(1).max(1000)
    })
    return schemaValidation.validate(data)
}

const commentValidation = (data) =>{
    const commentValidation = joi.object({
        postitId:joi.string().required().min(10).max(100),
        owner:joi.string().required().min(3).max(100),
        content:joi.string().required().min(1).max(300)
    })
    return commentValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postitValidation = postitValidation
module.exports.commentValidation = commentValidation