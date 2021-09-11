const express = require('express')
const mongoose = require('mongoose')
const path = require("path");
var cors = require('cors')
require('dotenv').config()
const app = express()



mongoose.connect(process.env.MONGOATLAS_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
      .then(() => { console.log('Mongo Atlas connected....') })
      .catch((e) => { console.log('Error inmongo Atlas connection') });




app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))



const temp = require('./routes/temp');
app.use('/temp', temp);

const ClientR = require('./routes/Client')
app.use('/client', ClientR)

const Providers = require('./routes/Serviceman')
app.use('/pro', Providers)

const ProService = require('./routes/SmService')
app.use('/pser', ProService)

const CtServiceR = require('./routes/CtService')
app.use('/ctcurrent', CtServiceR)




const PORT = process.env.PORT || 9000;
app.listen(9000, () => {
      console.log("Server listening...")
})