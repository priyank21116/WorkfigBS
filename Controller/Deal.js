const express = require('express');
const router = express.Router();

const pastDeal = require("../models/PastDeals")
const DealAtNow = require("../models/Deal")

const requireLogin = require("../middleware/requireLogin")

const WorkDeal = async (req, res) => {


      console.log("workupdateONdeal", req.body)
      try {
            const Deal = await DealAtNow.findOneAndUpdate({ _id: req.params.dealid }, { WorkDone: req.body.WorkDone }, { new: true })
            res.status(200).json({
                  "message": "User Registered Successfuly",
                  Deal
            });


      } catch (error) {
            console.log("workupdateONdeal::", error);
            res.status(500).json({
                  message: error
            });
      }

}


const ReviewSm = async (req, res) => {
      try {

      } catch (error) {
            console.log("REvie Sm from Deal::", error);
            res.status(500).json({
                  message: error
            });
      }
}