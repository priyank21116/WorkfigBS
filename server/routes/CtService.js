const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Currentclient = require("../models/CtCurrent")
const jwtkey = process.env.JWT_SECRET


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
// localhost:9000/ctcurrent/domainNlocation
router.post("/domain", requireLogin, async (req, res) => {
      const { lat, lng, helpDomain, SpecifyHelp } = req.body
      try {
            const user = await Currentclient.findOne({ClientIdentity: req.user})
            if(!user){
                  await Currentclient({
                        ClientIdentity: req.body,
                        helpDomain: helpDomain,
                        SpecifyHelp: SpecifyHelp,
                        livelocation: {
                              lat: lat,
                              lng: lng
                        },
                        SelectedWorker :"",
                        DealSet:false,
                        WorkDone:false,
                  }).save()
            }else{
                  user = Currentclient({
                        ...user,
                        helpDomain: helpDomain,
                        SpecifyHelp: SpecifyHelp,
                        livelocation: {
                              lat: lat,
                              lng: lng
                        },
                        SelectedWorker :"",
                        DealSet:false,
                        WorkDone:false,
                  }).save()
            }
    

      } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving Domains");
      }
})

//fix servent
//2
// localhost:9000/ctcurrent/select
router.patch("/select/:Smid",requireLogin, async (req, res) => {
      const { selected, DealSet } = req.body
      try {
            const user = await Currentclient.findOne({ClientIdentity: req.user})

            user = Customer({
                        ...user,
                        SelectedWorker: selected,
                        DealSet: DealSet,
            }).save()

      } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
      }
})

//3
router.patch("/:id/review", async (req, res) => {
      try {
            const { Done, newreview } = req.body
            let user = await Customer.findOne({
                  _id: req.params.id
            })

            user = Customer({
                  ...user,

                  review: [...review, newreview]

            })

      }

      catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
      }
})
//4

router.get("/:id/getCdetails", async (req, res) => {
      try {
            let CD
            const Cus = await Customer.findOne({
                  _id: req.params.id
            })

            CD = {
                  location: Cus.livelocation,
                  name: PersonalDetail.name,
                  phone: PersonalDetail.phone,
                  address: PersonalDetail.address,
                  helpDomain: Current.helpDomain,
                  SpecifyHelp: Current.SpecifyHelp
            }

            res.status(200).json(CD);


      } catch (e) {
            console.error(e);
            res.status(500).json({
                  message: "Server Error"
            });
      }
})

module.exports = router