// set up database connection and routing here
const mongoose = require('mongoose')
const dcfRoute = require('./routes/dcf')
const registerRoute = require('./routes/register')
const loginRoute = require('./routes/login')
const router = require('express').Router()

mongoose.set('useFindAndModify', false )
mongoose.set('useNewUrlParser', true )
mongoose.set('useUnifiedTopology', true )
mongoose.set('useCreateIndex', true )

mongoose.connect(`mongodb://localhost/valuation`)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err))

//routes
router.use('/dcf', dcfRoute)
 
// registration and login no longer needed, using okta for auth

// router.use('/register', registerRoute)
// router.use('/login', loginRoute)


module.exports = router