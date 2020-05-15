const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.middleware");
const User = require("../../models/User.model");
const Component = require("../../models/Component.model");
const Profile = require('../../models/Profile.model')

//@route  GET api/component
//@desc   get current user profile
//@access private
router.post('/', [
    auth,
    [check("name", "Name is required").notEmpty(),
    // check("image", "Image is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
    check("url", "Url is required").isURL()
    ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const profile = await Profile.findOne({
                user: req.user.id,
            }).populate("user", ["name", "email"]);

            const { name, description, url } = req.body;
            const componentFields = {};

            let component = await Component.findOne({ url });

            // check component if exists
            if (component) {
                return res.status(500).send({
                    msg: "This Component already exist!"
                })
            }


            // create a ne components
            if (name) componentFields.name = name;
            if (description) componentFields.description = description;
            if (url) componentFields.url = url;

            componentFields.creator = {}

            componentFields.creator.name = profile.user.name;
            componentFields.creator.email = profile.user.email;
            componentFields.creator.website = profile.website;
            componentFields.images = []

            // add  images missing

            component = new Component(componentFields);
            await component.save();
            res.send(component);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    });


module.exports = router;