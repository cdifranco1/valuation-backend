const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const apiRoute = require('./api')
require('dotenv').config()

const port = process.env.PORT || 5000

const server = express()

//app-level middleware
const whitelist = ['http://localhost:3000', 'https://valuation-gamma.vercel.app' ]

server.use(cors({
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
server.use(express.json())
server.use(cookieParser())

//api route
server.use('/api', apiRoute)

server.get('/', (req, res) => {
  res.status(200).json("Server is running.")
})

server.listen(port, () => {
  console.log(`Listening on port 5000`)
})

module.exports = server