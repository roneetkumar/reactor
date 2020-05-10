const express = require("express");
const router = express.Router();
const Profile = require("../../Models/Profile");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

//@route  GET api/profile
//@desc   get  user profile
//@access private
router.get("/", (req, res) => {
  try {
    res.send("get profile route");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
