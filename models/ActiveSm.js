const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const ActiveSmSchema = new mongoose({

      ServicemanIdentity:{
            type: ObjectId,
            ref: "ServicemanPerDetail"
      },
      
      livelocation:{
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
      },
      Domain: String,
      

})
module.exports = mongoose.model('ActiveServicePerson',ActiveSmSchema)