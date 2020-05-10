const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator')



router.post(
    '/',
    [
        check('name', 'Name required').notEmpty(),
        check('email', 'Email required').isEmail(),
        check('password', 'Length should be more than 8 character').isLength({min:8}),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }

        res.send('user route')
    }
)



module.exports = router
