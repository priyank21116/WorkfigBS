const mongoose = require('mongoose')

const SmPerSchema = new mongoose.Schema({

      name: String,

      about: String,
      phone: String,
      emergencyPhone: String,
      email: String,
      password: String,
      adharNo: String,

      adharPhoto: {
            data: Buffer,
            contentType: String
      },
      ProfilePhoto: {
            data: Buffer,
            contentType: String
      },
      validationPhoto: {
            data: Buffer,
            contentType: String
      },



      residencial: {
            Rad1: String,
            Rad2: String,
            Rlandmark: String,
            Rpin: String,
            Rcity: String,
            Rstate: String,
      },
      workplace: {
            ad1w: String,
            landmarkw: String,
            pincodew: String,
      },
      review: [],
      //{ givenby_id : ,RateOn5 :  ,comment : }

})

module.exports = mongoose.model('ServicemanPerDetail', SmPerSchema)