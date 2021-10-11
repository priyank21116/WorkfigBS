const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types




const Reviews = new mongoose.Schema({
      Sm_id: {
            type: ObjectId,
            index: true,
            auto: true
      },
      givenby_id: {
            type: ObjectId,
            index: true,
            auto: true,
            ref: ""
      },
      givenby_name: String,
      RateOn5: {
            type: Number,
            min: 1,
            max: 5
      },
      comment: String,
      onDate: {
            type: Date,
            default: Date.now()
      }
}, { timestamps: true }
)




const SmPerSchema = new mongoose.Schema({

      name: {
            type: String,
            minlength: 2,
            maxlength: 200,
            trim: true
      },
      about: String,
      phone: String,
      emergencyPhone: String,
      email: String,
      password: String,
      adharNo: String,

      adharPhoto:  {
            data: Buffer,
            contentType: String,
      },
      ProfilePhoto: {
            data: Buffer,
            contentType: String,
      },
      validationPhoto: {
            data: Buffer,
            contentType: String,

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
      OnActiveDetails: {
            type: ObjectId,
            ref: "ActiveServicePerson"
      },
      reviews: [Reviews]


}, { timestamps: true })

    
// ServicemanPerDetail.reviews.push({ obj contain givenbyid name comment....})
// ServicemanPerDetail.save((err,data)=>{});


// const ServicemanPerDetail 
module.exports = mongoose.model('ServicemanPerDetail', SmPerSchema)
// const Revieww = mongoose.model('Review', Reviews)

// module.exports = { ServicemanPerDetail, Revieww }