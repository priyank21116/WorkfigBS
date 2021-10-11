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
      console.log("::::::::::::::Header", req.headers)
      if (!authorization) {
            return res.status(401).json({ error: "User Must be Logged in to use this service" })
      }
      try {
            // console.log("ithe::::::::", jwt.verify(authorization, jwtkey))
            const userIdd = jwt.verify(authorization, jwtkey)
            // console.log(":::::::::::::::::userId",userIdd.userId)
            req.user = userIdd.userId
            next()
      } catch (err) {
            return res.status(401).json({ error: " INvalid user not verified" })
      }
}

//get all Clients 

router.get('/getAllActiveCt', async (req, res) => {

      try {

            const u = await ActiveCt.find()
            .select("-password")
                  .populate("ClientIdentity")
            res.send(u)

      } catch (err) {
            res.status(402).send(err)
      }
})


//1
// localhost:9000/ctcurrent/ActivateCtforSERACH
router.post("/ActivateCtforSERACH", requireLogin, async (req, res) => {
      console.log("ID>>>>>>>>>>>.", req.user)
      console.log("ACTIVATE CLIENT Search REQUEST", req.body)
      const { lat, lng, helpDomain, SpecifyHelp } = req.body
      try {
            const user = await ActiveCt.findOne({ ClientIdentity: req.user })
            console.log("USER FOUND ", user)
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
router.delete("/SerchCompleted", requireLogin,
      async (req, res) => {
            console.log("DEactivate SM USER REQ TOKEN", req.user)

            try {
                  let Auser = await ActiveCt.findOne({ ClientIdentity: req.user })

                  if (!Auser) {
                        return res.status(400).json({
                              error: "Already deactivated"
                        });
                  }

                  ActiveCt.findOneAndDelete({ ClientIdentity: req.user }, function (err, doc) {
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
                  console.log("1")
                  const Clientdetail =await ActiveCt.findOne({ ClientIdentity: req.user })
                  const { livelocation, helpDomain } = Clientdetail
                  

                  //Search on ActiveSm by location +_10 then by domain
                  const u = await ActiveSm.find({ Domain:helpDomain })
                        .select("-emergencyPhone -phone -password -adharNo -residencial ")
                        .populate("ServicemanIdentity")
                  res.status(200).json(u)

                  //return that array to user
            } catch (err) {
                  console.log(err)
                  return res.status(401).statusText("Fail").json({ error: err })
            }
      })



      // getSmDeatil
router.get("/getSmDeatil/:serId",requireLogin,

async (req,res)=>{
      try{
      const Sm = await ActiveSm.findOne({ClientIdentity: req.user})
      .populate("ServicemanIdentity")
      .select("-emergencyPhone -password -adharNo -residencial")

      res.status(200).json({Sm})
      }catch(e){
            console.log("getSmDeatil",e)
            return res.status(401).statusText("Fail").json({ error: err })

      }
})


// Set deal
// localhost:9000/ctcurrent/setdeal
router.post("/setdeal/:serId", requireLogin,
      async (req, res) => {
            console.log(" DEAL SET INFO ", req.body, "User REQ",req.user)

            try {

      // pass Ctlocation Domain for req.body
      const {Ctlocation , Domain, dealPrice} = req.body
                  const Ctid = req.user.userId;
                  const Smid = req.params.serId;

      //from ActiveCt get live location and domain
                  // const ActiveCtdetail = await ActiveCt.findOne({ ClientIdentity: Ctid })

                  // const Ctlocation = ActiveCtdetail.livelocation;
                  // const Domain = ActiveCtdetail.helpDomain;

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











//patch rating to SM



//ONWORK DONE  DELECTE Work
// Delete personal details,keep names





module.exports = router