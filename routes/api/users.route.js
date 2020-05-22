const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../models/User.model')
const bcrypyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


router.post(
    '/',
    [
        check('name', 'Name required').notEmpty(),
        check('email', 'Email required').isEmail(),
        check('password', 'Length should be more than 8 character').isLength({ min: 8 }),
        check('type', 'Type required').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        // Checking Errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            // Data from request body
            const { name, email, password, type } = req.body;

            let user = await User.findOne({ email });

            // Checking if user exists
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // New user
            user = new User({ name, email, password, type })

            //Password encryption
            const salt = await bcrypyt.genSalt(10);

            user.password = await bcrypyt.hash(password, salt);

            await user.save();

            // JWT Setup
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) {
                        throw err
                    }
                    res.json({ token });
                }
            )
        } catch (error) {
            console.log(error.message);
            res.status(400).send('Server Error')
        }

    }
)

module.exports = router
