const mongoose = require('mongoose');

const WishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    components: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'component'
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

module.exports = WishList = mongoose.model('wishlist', WishListSchema)
