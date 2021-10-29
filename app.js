const express = require('express')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()

const app = express()

const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// app.get('/api/users', (req, res) => {
//   res.status(200).send('hi')
// })

app.use('/api/users', userRoutes)

module.exports = app

// expect.any(String)
