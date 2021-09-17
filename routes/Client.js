const express = require('express');
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtkey = process.env.JWT_SECRET

const ClientPer = require("../models/ClientPerM");




//localhost:9000/client/registerone
router.post(
      "/registerone",
      async (req, res) => {
            let { phone } = req.body;
            console.log("PHONE REGISTER R R<<<<<<<<<<", req.body)
            try {
                  if (!phone) { return res.status(422).json({ error: " Phone is left empty" }) }
                  let userRo = await ClientPer.findOne({ phone });
                  if (userRo) {
                        return res.status(400).json({
                              msg: "Phone Number Already Registered"
                        });
                  }

                  await new ClientPer({

                        phone: phone,

                  }).save();

                  res.status(200).json({ "message": "User Registered Successfuly" });

            } catch (err) {
                  console.log("/localhost:9000/Sm/registerone::", err.message);
                  res.status(500).send("Error in Saving");
            }
      })




//localhost:9000/client/registertwo
router.patch(
      "/registertwo",
      async (req, res) => {

            let { name, email, password, ad1, phone, ad2, landmark, pin, city, state } = req.body;

            try {
                  if (!email || !password) {
                        return res.status(422).json({ error: " Fields are left empty" })
                  }

                  let user = await ClientPer.findOne({
                        email
                  });
                  if (user) {
                        return res.status(400).json({
                              error: "Email Already Exists"
                        });
                  }



                  // const salt = await bcrypt.genSalt(10);
                  const hashPassword = await bcrypt.hash(password, 12);

                  let CmRegt = {
                        name: name,
                        // phone: phone,
                        email: email,
                        address: {
                              ad1: ad1,
                              ad2: ad2,
                              landmark: landmark,
                              pin: pin,
                              city: city,
                              State: state,
                        },
                        // password: hashPassword,
                        password: password


                  }
                  let CMuserRt = await ClientPer.findOneAndUpdate({ phone }, CmRegt, { new: true });

                  res.status(200).json({
                        "message": "User Registered Successfuly",
                         CMuserRt
                  });

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

                  // const isMatch = await bcrypt.compare(password, user.password);
                  const isMatch = password === user.password
                  if (isMatch) {
                        const token = jwt.sign({ userId: user._id }, jwtkey)
                        res.status(201).json({ token: token })

                  } else {
                        return res.status(401).json({ error: "Incorrect mobile number or Password !" });
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