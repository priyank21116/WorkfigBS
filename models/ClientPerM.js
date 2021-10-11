const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const ClientPersonalDetail = new mongoose.Schema({
      Name: { type: String, default: "" },
      phone: { type: Number, required: true, default: 0 },
      email: { type: String, default: "" },
      emergencyNo: { type: Number, default: 0 },
      address: {
            ad1: { type: String, default: "" },
            ad2: String,
            landmark: { type: String, default: "" },
            pin: { type: Number, default: 0 },
            city: String,
            Statee: String,
      },
      password: { type: String, default: "" },
      review: [{
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
      }],
      PerImg: String
      //{_id : ,RateOn5 : }

}, { timestamps: true })

module.exports = mongoose.model('Clientpersonal', ClientPersonalDetail)