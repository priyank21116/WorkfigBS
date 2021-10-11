const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const PastDeals = new mongoose.Schema({
      ClientOnSetID: {
            type: ObjectId,
            ref: "Clientpersonal"
      },
      ServicemanOnSetID: {
            type: ObjectId,
            ref: "ServicemanPerDetail"
      },
      Domain: String,
     
      dealPrice: Number,
      SetOnTime: {
            type: Date,
      }
})

module.exports = mongoose.model("pastDeal", PastDeals)
