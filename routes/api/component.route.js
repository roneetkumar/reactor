const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.middleware");
const User = require("../../models/User.model");
const Component = require("../../models/Component.model");
const Profile = require('../../models/Profile.model')

//@route  GET api/component
//@desc   get CreateComponent
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


            // create a new components
            if (name) componentFields.name = name;
            if (description) componentFields.description = description;
            if (url) componentFields.url = url;

            componentFields.creator = {}

            componentFields.creator.name = profile.user.name;
            componentFields.creator.email = profile.user.email;
            componentFields.creator.website = profile.website;
            componentFields.images = [];
            componentFields.profile = profile._id;


            // add  images missing


            component = new Component(componentFields);
            await component.save();
            res.send(component);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    });

//@route  GET api/component
//@desc   get all Components
//@access public
router.get('/', async (req, res) => {
    try {
        const components = await Component.find();
        res.json(components);
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})


//@route  GET api/component/profile/:profileId
//@desc   get personalComponents
//@access public
router.get('/profile/:profileid', async (req, res) => {
    try {
        const components = await Component.find({
            profile: req.params.profileid
        });
        return res.json(components);
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})


//@route  GET api/component/:componentId
//@desc   get singleComponents
//@access public
router.get('/:componentId', async (req, res) => {

    try {
        const component = await Component.findOne({
            _id: req.params.componentId
        });

        if (!component) {
            return res.status(400).json({ msg: "Component does not exist." });
        }
        res.json(component);
    } catch (error) {

        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res.status(400).json({ msg: "Component does not exist" });
        }
        res.status(500).send("server error");
    }
})

//@route  GET api/component/:componentId
//@desc   get deleteComponent
//@access public
router.delete('/:componentId', async (req, res) => {

    try {
        const component = await Component.findOneAndRemove({
            _id: req.params.componentId
        });

        res.json({ msg: 'Component has been removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})


//@route  GET api/component/:componentId
//@desc   get updateComponent
//@access private
router.put('/:componentId', auth, async (req, res) => {

    try {
        let component = await Component.findOne({
            _id: req.params.componentId
        })

        if (component) {
            const component = await Component.findOneAndUpdate({
                _id: req.params.componentId,
                url: req.body.url
            });
            return res.json(component);
        }
        res.json({ msg: 'Component not found' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})


//@route  GET api/component/:componentId/like
//@desc   get likeComponent
//@access private
router.put('/:componentId/like', auth, async (req, res) => {

    try {
        const component = await Component.findById({
            _id: req.params.componentId
        })
        if (
            component.likes.filter((like) => like.user.toString() === req.user.id).length >
            0
        ) {
            return res.status(400).json({ msg: "This component has already been liked.!" });
        }
        component.likes.unshift({ user: req.user.id });
        await component.save();
        res.json(component);

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('server error');
    }
})


//@route  GET api/component/:componentId/unlike
//@desc   get unlikeComponent
//@access private
router.put('/:componentId/unlike', auth, async (req, res) => {

    try {
        const component = await Component.findById({
            _id: req.params.componentId
        })
        if (
            component.likes.filter((like) => like.user.toString() === req.user.id).length ===
            0
        ) {
            return res.status(400).json({ msg: "This component has not been liked yet.!" });
        }


        const removeIndex = component.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);
        component.likes.splice(removeIndex, 1);
        await component.save();

        res.json(component);

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('server error')
    }
})

module.exports = router;