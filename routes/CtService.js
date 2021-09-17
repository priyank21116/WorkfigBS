const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const jwtkey = process.env.JWT_SECRET

const DealAtNow = require("../models/Deal")
const ActiveSm = require("../models/ActiveSm")
import ActiveCt from '../models/ActiveCt';
// const ActiveCt = require("../models/ActiveCt")


const requireLogin = (req, res, next) => {
      const { authorization } = req.headers
      if (!authorization) {
            return res.status(401).json({ error: "User Must be Logged in to use this service" })
      }
      try {
            const [userId] = jwt.verify(authorization, jwtkey)
            req.user = userId
            next()
      } catch (err) {
            return res.status(401).json({ error: " INvalid user not verified" })
      }
}


//1
// localhost:9000/ctcurrent/ActivateCtforSERACH
router.post("/ActivateCtforSERACH", requireLogin, async (req, res) => {
      console.log("ACTIVATE CLIENT Search REQUEST", req.body)
      const { lat, lng, helpDomain, SpecifyHelp } = req.body
      try {
            const user = await ActiveCt.findOne({ ClientIdentity: req.user.userId })
            if (!user) {
                  await ActiveCt({
                        ClientIdentity: req.user.userId,
                        helpDomain: helpDomain,
                        SpecifyHelp: SpecifyHelp,
                        livelocation: {
                              lat: lat,
                              lng: lng
                        },

                  }).save()

                  res.status(200).json({ "message": "Search  Activated Successfuly" });
            } else {

                  return res.status(400).json({
                        error: "You are already active to recive work "
                  });

                  //      const  newActivateuser = {
                  //             ...user,
                  //             helpDomain: helpDomain,
                  //             SpecifyHelp: SpecifyHelp,
                  //             livelocation: {
                  //                   lat: lat,
                  //                   lng: lng
                  //             },

                  //       }


            }


      } catch (err) {
            console.log(err.message);
            res.status(500).send("Ct Serach for domain");
      }
})


// SEACRH DONE or deactive client

// localhost:9000/ctcurrent/SerchCompleted
router.post("/SerchCompleted", requireLogin,
      async (req, res) => {
            console.log("DEactivate SM USER REQ TOKEN", req.user)

            try {
                  let Auser = await ActiveCt.findOne({ ClientIdentity: req.user.userId })

                  if (!Auser) {
                        return res.status(400).json({
                              error: "Already deactivated"
                        });
                  }

                  ActiveCt.findOneAndDelete({ ClientIdentity: req.user.userId }, function (err, doc) {
                        if (err) {
                              res.status(500).json({ err })
                        } else {
                              console.log("Deleted doc", doc)
                              res.status(200).json({ "msg": "Deactivated Id" })
                        }
                  })



            } catch (e) {
                  console.log("h::", e);
                  res.status(500).json({
                        message: "Server Error"
                  });
            }
      })

// Get suitable Serviceman

// localhost:9000/ctcurrent/getsuitableSm
router.get("/getsuitableSm", requireLogin,
      async (req, res) => {
            //take token
            console.log("IN CtService GET SUITABLE SM", req.user)
            try {
                  //search on ActiveCt get domian, livelocation,
                  let userr = await ActiveCt.findOne({ ClientIdentity: req.user.userId })

                  let Ctdomain = userr.helpDomain;
                  let Ctloclat = userr.livelocation.lat;
                  let Ctloclng = userr.livelocation.lng;
                  console.log("Here error", typeof (Ctloclat))

                  //Search on ActiveSm by location +_10 then by domain







                  //return that array to user
            } catch (err) {
                  console.log(err)
                  return res.status(401).statusText("Fail").json({ error: err })
            }
      })









// Set deal

// localhost:9000/ctcurrent/setdeal
router.post("/setdeal/:serId", requireLogin,
      async (req, res) => {
            console.log(" DEAL SET INFO ", req.body)

            try {
                  //get ct id by token
                  //pass SM id in params
                  const Ctid = req.user.userId;
                  const Smid = req.params.serId;

                  //from ActiveCt get live location and domain
                  const ActiveCtdetail = await ActiveCt.findOne({ ClientIdentity: Ctid })

                  const Ctlocation = ActiveCtdetail.livelocation;
                  const Domain = ActiveCtdetail.helpDomain;

                  // from ActiveSm Search get live location
                  const ActiveSmdetail = await ActiveSm.findOne({ ServicemanIdentity: Smid })
                  const Smlocation = ActiveSmdetail.livelocation;



                  
// Set CTpersonaldetail
// Set SM personal detail


                 const newDealNow = await new DealAtNow({

                        ClientOnSetID: Ctid,
                        ServicemanOnSetID: Smid,
                        SMlocation: Smlocation,
                        CMlocation: Ctlocation,
                        Domain: Domain

                  })
                 await newDealNow.save();
                  // save below on DealAtNow
                  res.status(200).json({ newDealNow })


            } catch (error) {
                  console.log("DEAL SET ERROR", error)
                  res.status(500).json({
                        message: "Server Error"
                  });
            }

      })









//patch for workdone
// localhost:9000/ctcurrent/workupdateONdeal
router.patch("/workupdateONdeal/:dealid",
async(req,res)=>{
      console.log("workupdateONdeal",req.body)
      try {
            const Deal = await DealAtNow.findOne({ _id:req.params.dealid })
            
            
            
      } catch (error) {
            console.log("workupdateONdeal::", error);
            res.status(500).json({
                  message: error
            });
      }

})

//patch for price


//patch rating to SM



//ONWORK DONE  DELECTE Work
// Delete personal details,keep names





module.exports = router