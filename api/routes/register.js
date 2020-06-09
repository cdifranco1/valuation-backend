/*  ************************************
    User registration routes no longer needed, using Okta for authentication
    ************************************


const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { User, validate } = require('../models/user-model')


router.post('/', async (req, res) => {
  let user = req.body
  const { error } = validate(user)
  if (error) return res.status(400).json({ message:"Invalid request." })

  try {
    const hash = bcrypt.hashSync(user.password)
    user.password = hash 

    user = new User(user)
    const savedUser = await user.save()

    res.status(200).json(savedUser)
    
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router


*/
