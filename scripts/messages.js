const express = require('express')

const postitMessage = String('You are viewing the Post-It wall. Like and comment to interact with the post-its')
const welcome = String("Welcome to Post-It. The auth-token provided below will be required to access postits. Postits can be accessed at localhost:3001/api/pile. Paste the auth-token as a key:value pair in Headers. Don't forget to change from GET to POST!")
const registered = String('You have successfully registered. To login, please go to localhost:3001/api/user/login and login using your email and password.')
const postedData = String("Congratulations, you have uploaded a post-it!")
const commentPosted = String("You have commented on this post")
const likePosted = String("You have liked this post")
const authDeny = String('Access denied. Use auth-token provided on login.')
const selfLike = String("You can't like your own post-it!")
const selfComment = String("You can't comment on your own post-it")
const checkOwner = String("Check owner for typo - the name isn't in the database!")
const idExists = String("Postit ID doesn't seem to be in the database... Check and try again!")
const uniqueTitle = String("The title you've chosen is already a postit. Pick a unique title!")

module.exports.postitMessage = postitMessage
module.exports.welcome = welcome
module.exports.registered = registered
module.exports.postedData = postedData
module.exports.commentPosted = commentPosted
module.exports.likePosted = likePosted
module.exports.authDeny = authDeny
module.exports.selfLike = selfLike
module.exports.selfComment = selfComment
module.exports.checkOwner = checkOwner
module.exports.idExists = idExists
module.exports.uniqueTitle = uniqueTitle