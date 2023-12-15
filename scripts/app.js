const express = require('express')

const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())


const pileRoute = require('./routes/postits')
const authRoute = require('./routes/user-auth')

app.use('/api/pile', pileRoute)
app.use('/api/user', authRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected')
})

app.listen(3001, ()=>{
    console.log('server is running')
})