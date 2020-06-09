// const mongoose = require('mongoose')
// const Joi = require('joi')

// const User = mongoose.model('User', new mongoose.Schema({
//     name: {
//       type: String,
//       required: true, 
//       minlength: 3,
//       maxlength: 255,
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: true, 
//       minlength: 5,
//       maxlength: 255,
//     },
//   })
// )

// function validateUser(user){
//   const schema = {
//     name: Joi.string().min(3).max(255).required(),
//     email: Joi.string().min(5).max(255).required().email()
//   }

//   return Joi.validate(user, schema)
// }


// exports.validate = validateUser

// exports.User = User



