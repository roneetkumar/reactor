const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.middleware");
const User = require("../../models/User.model");
const Component = require("../../models/Component.model");
const Profile = require('../../models/Profile.model')

//@route  POST api/component
//@desc   Create Component
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


//@route  GET api/component/profile/:id
//@desc   Get Personal Components
//@access public
router.get('/profile/:id', async (req, res) => {
    try {
        const components = await Component.find({
            profile: req.params.id
        });
        return res.json(components);
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})


//@route  GET api/component/:id
//@desc   Get Single Component
//@access public
router.get('/:id', async (req, res) => {

    try {
        const component = await Component.findOne({
            _id: req.params.id
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


//@route  GET api/component/:id
//@desc   Delete Component
//@access public
router.delete('/:id', async (req, res) => {

    try {
        const component = await Component.findOneAndRemove({
            _id: req.params.id
        });

        res.json({ msg: 'Component has been removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})


//@route  GET api/component/:id
//@desc   Update Component
//@access private
router.put('/:id', auth, async (req, res) => {

    try {
        let component = await Component.findOne({
            _id: req.params.id
        })

        if (component) {
            const component = await Component.findOneAndUpdate({
                _id: req.params.id,
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


//@route  GET api/component/:id/like
//@desc   Like Component
//@access private
router.put('/:id/like', auth, async (req, res) => {

    try {
        const component = await Component.findById({
            _id: req.params.id
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


//@route  GET api/component/:id/unlike
//@desc   Unlike Component
//@access private
router.put('/:id/unlike', auth, async (req, res) => {

    try {
        const component = await Component.findById({
            _id: req.params.id
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


//@route  GET api/component/:id/rating
//@desc   create rating
//@access private
router.post('/:id/rating', [
    auth,
    [
        check('stars', 'should be a number').isNumeric(),
    ]
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const profile = await Profile.findOne({
            user: req.user.id,
        }).populate("user", ["name"]);

        let component = await Component.findById(req.params.id);

        const rating = {
            text: req.body.text,
            userId: req.user.id,
            stars: req.body.stars,
            name: profile.user.name,
            avatar: profile.avatar,
        }

        let found = false;

        for (let i = 0; i < component.ratings.length; i++) {
            if (component.ratings[i].userId.toString() === req.user.id.toString()) {
                component.ratings[i] = rating;
                found = true
                break;
            }
        }

        if (!found) {
            component.ratings.unshift(rating);
        }

        await component.save();
        res.json(component);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})


//@route  GET api/component/:id/rating
//@desc   get all ratings
//@access public
router.get('/:id/rating', async (req, res) => {
    try {
        const component = await Component.findOne({
            _id: req.params.id
        });

        res.json(component.ratings);

    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") return res.status(400).json({ msg: "rating does not exist" });
        res.status(500).send("server error");
    }
})



//@route  GET api/component/:id/rating/:id
//@desc   get single rating
//@access public
router.get('/:id/rating/:ratingId', async (req, res) => {
    try {
        const component = await Component.findOne({
            _id: req.params.id
        });

        const rating = component.ratings.filter(rating => rating._id.toString() === req.params.ratingId.toString())

        if (rating.length === 0) return res.status(400).json({ msg: "rating does not exist." });

        res.json(rating);

    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") return res.status(400).json({ msg: "rating does not exist" });
        res.status(500).send("server error");
    }
})


//@route  GET api/component/:id/rating/:ratingId
//@desc   delete Component
//@access private
router.delete('/:id/rating/:ratingId', auth, async (req, res) => {

    try {
        const component = await Component.findById({
            _id: req.params.id
        })

        component.ratings = component.ratings.filter(rating => rating._id.toString() !== req.params.ratingId.toString())

        await component.save();

        res.json({ msg: "rating deleted" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('server error')
    }
})

module.exports = router;
