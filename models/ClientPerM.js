const mongoose = require('mongoose')

const ClientPersonalDetail = new mongoose.Schema({
      Name:{type: String, default:""},
      phone: {type:Number, required: true ,default:0},
      email: {type: String, default:""},
      emergencyNo:{type:Number,default:0},
      address: {
            ad1: {type: String, default:""},
            ad2: String,
            landmark: {type: String, default:""},
            pin: {type:Number,default:0},
            city: String,
            Statee: String,
      },
      password: {type: String, default:""},
      review: [],
      //{_id : ,RateOn5 : }



})

module.exports = mongoose.model('Clientpersonal', ClientPersonalDetail)