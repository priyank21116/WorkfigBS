const express = require('express');
const router = express.Router();

const pastDeal = require("../models/PastDeals")
const DealAtNow = require("../models/Deal")
 
const requireLogin= require("../middleware/requireLogin")

//patch for workdone
// localhost:9000/ctcurrent/workupdateONdeal
router.post("/workupdateONdeal/:dealid", requireLogin , )

router.post("/postSmReview",requireLogin,)