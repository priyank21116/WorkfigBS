const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const jwtkey = process.env.JWT_SECRET

const DealAtNow = require("../models/Deal")
const ActiveSm = require("../models/ActiveSm")

const ActiveCt = require("../models/ActiveCt")


const requireLogin = (req, res, next) => {

      const { authorization } = req.headers
      // console.log("::::::::::::::Header", req.headers)
      if (!authorization) {
            return res.status(401).json({ error: "User Must be Logged in to use this service" })
      }
      try {
            console.log("ithe::::::::", jwt.verify(authorization, jwtkey))
            const userIdd = jwt.verify(authorization, jwtkey)
            // console.log(":::::::::::::::::userId",userIdd.userId)
            req.user = userIdd.userId
            next()
      } catch (err) {
            return res.status(401).json({ error: " INvalid user not verified" })
      }
}


//1
// localhost:9000/ctcurrent/ActivateCtforSERACH
router.post("/ActivateCtforSERACH", requireLogin, async (req, res) => {
      console.log("ID>>>>>>>>>>>.", req.user)
      console.log("ACTIVATE CLIENT Search REQUEST", req.body)
      const { lat, lng, helpDomain, SpecifyHelp } = req.body
      try {
            const user = await ActiveCt.findOne({ ClientIdentity: req.user })
            console.log("USER FOUND ",user)
            if (user) {

                  return res.status(400).json({
                        error: "You are already active to recive work "
                  });
            }

            await new ActiveCt({
                  ClientIdentity: req.user,
                  helpDomain: helpDomain,
                  SpecifyHelp: SpecifyHelp,
                  livelocation: {
                        lat: lat,
                        lng: lng
                  },

            }).save();

            res.status(200).json({ "message": "Search  Activated Successfuly" });
      }
      //      const  newActivateuser = {
      //             ...user,
      //             helpDomain: helpDomain,
      //             SpecifyHelp: SpecifyHelp,
      //             livelocation: {
      //                   lat: lat,
      //                   lng: lng
      //             },

      //       }





      catch (err) {
            console.log("localhost:9000/ctcurrent/ActivateCtforSERACH", err.message);
            res.status(500).json({
                  message: "Server Error CtService"
            });
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
      async (req, res) => {
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

      })

//patch for price
router.patch("/dealpriceONdeal/:dealid",
      async (req, res) => {
            console.log("dealpriceONdeal", req.body)
            try {
                  const Deall = await DealAtNow.findOneAndUpdate({ _id: req.params.dealid }, { dealPrice: req.body.dealPrice }, { new: true })
                  res.status(200).json({
                        "message": "User Registered Successfuly",
                        Deall
                  });


            } catch (error) {
                  console.log("dealpriceONdeal::", error);
                  res.status(500).json({
                        message: error
                  });
            }

      })


//patch rating to SM



//ONWORK DONE  DELECTE Work
// Delete personal details,keep names





module.exports = router