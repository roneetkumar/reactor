const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile.model");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

//@route  GET api/profile
//@desc   get  user profile
//@access private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("users", ["name", "avatar", "type"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
