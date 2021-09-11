const mongoose = require('mongoose')

const ActiveSmSchema = new mongoose({
      livelocation:{
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
      },
      Domain: Array,


})
module.exports = mongoose.model('ActiveServicePrson',ActiveSmSchema)