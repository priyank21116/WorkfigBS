const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");


const Customer = require("../models/ClientPerM");



module.exports = router
