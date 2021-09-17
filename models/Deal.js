const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const DealSet = new mongoose.Schema({
      ClientOnSetID:{
            type: ObjectId,
            ref: "Clientpersonal"
      },
      ServicemanOnSetID:{
            type: ObjectId,
            ref: "ServicemanPerDetail"
      },
      // Ctname: "",
      // CtPerDetail:{

      // },
      // SMname: "",
      // SMPerDetail:{

      // },
      SMlocation:{

      },
      CMlocation:{

      },
      Domain:String,
      WorkDone: {type :Boolean, default: false},
      dealPrice:Number,
      SetOnTime: Date.now
})

module.exports= mongoose.model("AtmomentDeal",DealSet)