const mongoose = require('mongoose')

const SmPerSchema = new mongoose.Schema({
    
            name: String,
            // photo:String,
            about:String,
            phone: Number,
            emergencyPhone :Number,
            email: String,
            password: String,
            adharNo:Number,
            // adharPhoto : String,

            residencial: {
                  Rad1: String,
                  Rad2: String,
                  Rlandmark: String,
                  Rpin: Number,
                  Rcity: String,
                  Rstate: String,
            },
            workplace:{
                  ad1w:String,
                  landmarkw:String,
                  pincodew:String,
            },
             review:[],
             //{ givenby_id : ,RateOn5 :  ,comment : }

})

module.exports = mongoose.model('ServicemanPerDetail', SmPerSchema)