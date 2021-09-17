const express = require('express')
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtkey = process.env.JWT_SECRET

const ServicemanM = require("../models/ServicemanM");

const ActiveSm = require("../models/ActiveSm")

const ActiveCt = require("../models/ActiveCt")

const requireLogin = (req, res, next) => {
      const { authorization } = req.headers
      console.log("REquire LOGININNN SERVIEceMAN", req.headers)
      if (!authorization) {
            return res.status(401).json({ error: "User Must be Logged in to use this service" })
      }
      try {

            const decoded = jwt.verify(authorization, jwtkey)
            req.user = decoded
            next()

      } catch (err) {
            console.log(err)
            return res.status(401).statusText("Fail").json({ error: err })
      }
}


// http://localhost:9000/Smser/ActivateSm

router.post("/ActivateSm", requireLogin,
      async (req, res) => {
            console.log("ACTIAVTE SM USER REQ TOKEN", req.user)
            try {

                  let Auser = await ActiveSm.findOne({ ServicemanIdentity: req.user.userId })

                  if (Auser) {
                        return res.status(400).json({
                              error: "You are already active to recive work "
                        });
                  }
                  await new ActiveSm({
                        ServicemanIdentity: req.user.userId,
                        livelocation: {
                              lat: req.body.lat,
                              lng: req.body.lng
                        },
                        Domain: req.body.Domain,

                  }).save();

                  res.status(200).json({ "message": "User Id Activated Successfuly" });

            } catch (e) {
                  console.log("http://localhost:9000/Smser::", e);
                  res.status(500).json({
                        message: "Server Error"
                  });
            }
      }
);



//DELETE ACTIVE SM
// http://localhost:9000/Smser/DeactivateSm

router.post("/DeactivateSm", requireLogin,
async (req, res) => {
      console.log("DEactivate SM USER REQ TOKEN", req.user)
      
      try {
            let Auser = await ActiveSm.findOne({ ServicemanIdentity: req.user.userId })

            if (!Auser) {
                  return res.status(400).json({
                        error: "Already deactivated"
                  });
            }

            ActiveSm.findOneAndDelete({ ServicemanIdentity: req.user.userId},function (err,doc){
                  if(err){
                        res.status(500).json({err})
                  }else{
                        console.log("Deleted doc", doc)
                        res.status(200).json({"msg":"Deactivated Id"})
                  }
            })

            
            
      } catch (e) {
            console.log("http://localhost:9000/Smser/ActivateSm::", e);
            res.status(500).json({
                  message: "Server Error"
            });
      }
})



//GET ACTIVE SErviceman Deatils of Same workDomin IN area


// http://localhost:9000/Smser/getCLientsSuitable

router.get("/getCLientsSuitable",requireLogin,
async(req,res)=>{
      console.log(" get CLients Suitable")
      try {
            const AuserMe = await ActiveSm.findOne({ ServicemanIdentity: req.user.userId })
            if (!AuserMe){
                  return res.status(400).json({
                        error: "You Must be logedIN to Use this service .Loos like you are not. Try loginin Again"
                  });
            }
            let mylocation= AuserMe.livelocation
            let mydomain = AuserMe.Domain

            // const AvailWork= await ActiveCt.Fin

            

      } catch (error) {
            console.log("http://localhost:9000/Smser/getCLientsSuitable", e);
            res.status(500).json({
                  message: "Server Error"
            });
      }
}
)






module.exports = router
