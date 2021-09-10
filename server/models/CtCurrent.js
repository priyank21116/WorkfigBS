const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const CtCurrent = new mongoose.Schema({
      ClientIdentity:{
            type: ObjectId,
            ref: "Clientpersonal"
      },
      helpDomain: {type: String, required:true},
      SpecifyHelp: String,
      SelectedWorker: {
            type: ObjectId,
            ref: "ServicemanPerDetail"
      },
      DealSet: {type :Boolean, default: false},
      WorkDone: {type :Boolean, default: false},
      livelocation: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
      }
})

module.exports = mongoose.model('Currentclient',CtCurrent)