const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const CtCurrent = new mongoose.Schema({
      ClientIdentity:{
            type: ObjectId,
            ref: "Clientpersonal"
      },
      livelocation:{
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
      },
      helpDomain: {type: String, required:true},
      SpecifyHelp: String,
  
})

module.exports = mongoose.model('Currentclient',CtCurrent)