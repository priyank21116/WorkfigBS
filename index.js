const express = require('express')
const mongoose = require('mongoose')
const path = require("path");
var cors = require('cors')
require('dotenv').config()
const app = express()



mongoose.connect(process.env.MONGOATLAS_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false  })
      .then(() => { console.log('Mongo Atlas connected....') })
      .catch((e) => { console.log('Error inmongo Atlas connection') });


      

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });


const ClientR = require('./routes/Client')
app.use('/client', ClientR)


const CtServiceR = require('./routes/CtService')
app.use('/ctcurrent', CtServiceR)


const Providers = require('./routes/Serviceman')
console.log("here")
app.use('/sm', Providers)

const ProService = require('./routes/SmService')
app.use('/Smser', ProService)


 

const PORT = process.env.PORT || 9000;
app.listen(9000, () => {
      console.log("Server listening...")
})