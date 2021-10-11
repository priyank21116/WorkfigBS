const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const DealSet = new mongoose.Schema({
      ClientOnSetID: {
            type: ObjectId,
            ref: "Clientpersonal"
      },
      ServicemanOnSetID: {
            type: ObjectId,
            ref: "ServicemanPerDetail"
      },

      // },
      SMlocation: {

      },
      CMlocation: {

      },
      Domain: String,
     
      dealPrice: Number,
      SetOnTime: {
            type: Date,
            default: Date.now()
      }
})

module.exports = mongoose.model("AtmomentDeal", DealSet)