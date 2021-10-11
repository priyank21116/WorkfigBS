const express = require('express');
const jwt = require("jsonwebtoken");
const jwtkey = process.env.JWT_SECRET


module.export = requireLogin = async(req, res, next) => {
      const { authorization } = req.headers
      if (!authorization) {
            return res.status(401).json({ error: "User Must be Logged in to use this service" })
      }
      try {

            const decoded = jwt.verify(authorization, jwtkey)
            req.token = decoded
            next()

      } catch (err) {
            console.log(err)
            return res.status(401).statusText("Fail").json({ error: err })
      }
}
