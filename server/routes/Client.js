const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtkey =process.env.JWT_SECRET

const ClientPer = require("../models/ClientPerM");

//localhost:9000/client/signup
router.post(
      "/signup",
      async (req, res) => {

            let { name, email, phone, password, ad1, ad2, landmark, pin, city, state } = req.body;

            try {
                  if (!email || !password || !phone) {
                        return res.status(422).json({ error: " Fields are left empty" })
                  }

                  let user = await ClientPer.findOne({
                        email
                  });
                  if (user) {
                        return res.status(400).json({
                              error: "User Already Exists"
                        });
                  }

                  let u = await Customer.findOne({
                        phone
                  });
                  if (u) {
                        return res.status(400).json({
                              msg: "Phone Number Already Registered"
                        });
                  }




                  const salt = await bcrypt.genSalt(10);
                  const hashPassword = await bcrypt.hash(password, 12);

                  await new ClientPer({
                        name: name,
                        phone: phone,
                        email: email,
                        address: {
                              ad1: ad1,
                              ad2: ad2,
                              landmark: landmark,
                              pin: pin,
                              city: city,
                              State: state,
                        },
                        password: hashPassword


                  }).save();
                  res.status(200).json({ "message":"User Registered Successfuly" });

            } catch (err) {
                  console.log("/localhost:9000/client/signup::", err.message);
                  res.status(500).send("Error in Saving");
            }
      }
);


//localhost:9000/client/login
router.post(
      "/login",

      async (req, res) => {

            const { phone, password } = req.body;
            try {

                  if (!password || !phone) {
                        return res.status(422).json({ error: " Fields are left empty" })
                  }

                  const user = await ClientPer.findOne({ phone });
                  if (!user) {
                        return res.status(400).json({ error: "User Not Exist" });
                  }

                  const isMatch = await bcrypt.compare(password, user.password);
                  
                  if(isMatch){
                        const token = jwt.sign({userId:user._id},jwtkey)
                        res.status(201).json({token: token })

                  }else{
                        return res.status(401).json({error: "Incorrect mobile number or Password !" });
                  }


            } catch (e) {
                  console.log("localhost:9000/client/login::", e);
                  res.status(500).json({
                        message: "Server Error"
                  });
            }
      }
);


module.exports = router



// const payload = {
//       user: {
//             id: user.id
//       }
// };

// jwt.sign(
//       payload,
//       "randomString", {
//       expiresIn: 10000
// },
//       (err, token) => {
//             if (err) throw err;
//             res.status(200).json({
//                   token
//             });
//       }
// );