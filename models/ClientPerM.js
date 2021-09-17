const mongoose = require('mongoose')

const ClientPersonalDetail = new mongoose.Schema({
      name:{type: String, default:""},
      phone: {type:Number, required: true ,default:0},
      email: {type: String, default:""},
      address: {
            ad1: {type: String, default:""},
            ad2: String,
            landmark: {type: String, default:""},
            pin: {type:Number,default:0},
            city: String,
            State: String,
      },
      password: {type: String, default:""},
      review: [],
      //{_id : ,RateOn5 : }



})

module.exports = mongoose.model('Clientpersonal', ClientPersonalDetail)