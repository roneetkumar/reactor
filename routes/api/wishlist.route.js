const express = require('express');
const router = express.Router();
const WishList = require('../../models/WishList.model')
const auth = require('../../middleware/auth.middleware')

// @route   POST api/wishlist
// @desc    createWishlist
// @access  private
router.put("/:id", auth, async (req, res) => {
    let wishlist = await WishList.findOne({ user: req.user.id });
    const item = { id: req.params.id }

    if (!wishlist) wishlist = new WishList({ user: req.user.id, components: [item] })

    const found = wishlist.components.find((component) => component.id.toString() === req.params.id)

    if (!found) wishlist.components.push(item)

    wishlist.save()
    res.json(wishlist);
})


// @route   get api/wishlist
// @desc    get Wishlist
// @access  private
router.get("/", auth, async (req, res) => {
    let wishlist = await WishList.findOne({ user: req.user.id });

    if (!wishlist) return res.json({ msg: "You do not have any item " })

    res.json(wishlist);
})


// @route   delete api/wishlist/:id
// @desc    delete Wishlist
// @access  private
router.delete("/:id", auth, async (req, res) => {
    let wishlist = await WishList.findOne({ user: req.user.id });
    wishlist.components = wishlist.components.filter(component => component.id.toString() !== req.params.id)
    wishlist.save()
    res.json(wishlist);
})

module.exports = router
