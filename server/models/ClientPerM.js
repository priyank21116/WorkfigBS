const mongoose = require('mongoose')

const ClientPersonalDetail = new mongoose.Schema({
      name:{type: String, required:true},
      phone: {type:Number, required: true},
      email: {type: String, required:true},
      address: {
            ad1: {type: String, required:true},
            ad2: String,
            landmark: {type: String, required:true},
            pin: {type:Number, required: true},
            city: String,
            State: String,
      },
      password: {type: String, required:true},
      review: [],
      //{_id : ,RateOn5 : }



})

module.exports = mongoose.model('Clientpersonal', ClientPersonalDetail)