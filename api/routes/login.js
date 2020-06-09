/*  ************************************
    User registration routes no longer needed, using Okta for authentication, 
      still need to persist emails/names to connect DCF model to specific users
    ************************************ */


const jwt = require('jsonwebtoken')
const Joi = require('joi')
const router = require('express').Router()
const { User } = require('../models/user-model')
const authorization = require('../middleware/authorization') 


router.post('/', async (req, res) => {
  const authErr = { message: "Invalid credentials" }

  const { error } = validate(req.body)
  if (error) return res.status(400).json(error.details[0])

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email: email })

    if (!user) return res.status(401).json(authErr)

    const validPassword = bcrypt.compareSync(password, user.password)

    if (validPassword) {
      const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
      console.log(token)

      const cookieConfig = {
        httpOnly: true
      }

      res.cookie('token', token, cookieConfig)

      res.json({
        message: `Welcome ${user.name}`
      })
    }
  } catch(err){
    res.status(500).json({ message: err.message })
  }
})

router.get('/', authorization, async (req, res) => {
  
  try {
    const users = await User.find()

    res.status(200).json(users)

  } catch(err){
    res.status(500).json({ message: err.message })
  }
})

function validate(user){
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  }

  return Joi.validate(user, schema)
}


module.exports = router 
