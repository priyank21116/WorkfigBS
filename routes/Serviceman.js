const express = require('express')
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtkey = process.env.JWT_SECRET

const ServicemanM = require("../models/ServicemanM");



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
            return res.status(401).statusText("Ok").json({ error: err })
      }
}


//localhost:9000/sm/registerone
router.post(
      "/registerone",
      async (req, res) => {
            let { phone } = req.body;
            console.log("PHONE REGISTER R R<<<<<<<<<<" ,req.body)
            try {
                  if (!phone) { return res.status(422).json({ error: " Phone is left empty" }) }
                  let userRo = await ServicemanM.findOne({ phone });
                  if (userRo) {
                        return res.status(400).json({
                              msg: "Phone Number Already Registered"
                        });
                  }
     
                  await new ServicemanM({
                      
                        phone: phone,
                 
                  }).save();

                  res.status(200).json({ "message": "User Registered Successfuly" });

            } catch (err) {
                  console.log("/localhost:9000/Sm/registerone::", err.message);
                  res.status(500).send("Error in Saving");
            }
      })



// localhost:9000/sm/registertwo
router.patch(
      "/registertwo",
      async (req, res) => {

            let { name, emergencyPhone, about, phone, email, password, adharNo, Rad1, Rad2, Rlandmark, Rpin, Rcity, Rstate, ad1w, landmarkw, pincodew } = req.body.SmPer;

            try {
                  if (!email || !password) {
                        return res.status(422).json({ error: " Fields are left empty" })
                  }
                  let userRto = await ServicemanM.findOne({
                        email
                  });
                  if (userRto) {
                        return res.status(400).json({
                              error: "Email Already Exists"
                        });
                  }




                  const hashPassword = await bcrypt.hash(password, 12);

                  let userRtt = {
                        name: name,
                        emergencyPhone: emergencyPhone,
                        about: about,
                        email: email,
                        adharNo: adharNo,
                        residencial: {
                              Rad1,
                              Rad2,
                              Rlandmark,
                              Rpin,
                              Rcity,
                              Rstate,
                        },
                        workplace: {
                              ad1w,
                              landmarkw,
                              pincodew,
                        },
                        password: password
                        // password: hashPassword

                  }
                  let userRt = await ServicemanM.findOneAndUpdate({ phone }, userRtt, { new: true });

                  res.status(200).json({ userRt });

            } catch (err) {
                  console.log("/localhost:9000/sm/registertwo", err.message);
                  res.status(500).send("Error in Saving");
            }
      }
);


//localhost:9000/sm/login

router.post(
      "/login",
      async (req, res) => {
            console.log("LoginREquest CANMMME<<<" ,req.body)
            const { phone, password } = req.body;
            try {

                  if (!password || !phone) {
                        return res.status(422).json({ error: " Fields are left empty" })
                  }

                  const user = await ServicemanM.findOne({ phone });
                  if (!user) {
                        return res.status(400).json({ error: "User Not Exist" });
                  }

                  const isMatch = await bcrypt.compare(password, user.password);

                  if (isMatch) {
                        const token = jwt.sign({ userId: user._id }, jwtkey)
                        res.status(201).json({ token: token })

                  } else {
                        return res.status(401).json({ error: "Incorrect mobile number or Password !" });
                  }


            } catch (e) {
                  console.log("localhost:9000/sm/login::", e);
                  res.status(500).json({
                        message: "Server Error"
                  });
            }
      }
);


//localhost:9000/sm/getSmdetail

router.get("/getSmdetail", requireLogin,
      async (req, res) => {

            try {

                  const user = await ServicemanM.findOne({ _id: req.user.userId })

                  if (!user) {
                        res.status(422).json({ msg: "User Not found ,Token is invalid" })
                  }
                  res.status(201).json({ user })
            } catch (e) {
                  console.log("localhost:9000/sm/getSmdetail::", e);
                  res.status(500).json({
                        message: "Server Error"
                  });
            }
      }
);




module.exports = router