const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.middleware");
const User = require("../../models/User.model");
const Message = require("../../models/Message.model");
// @route   GET api/message/:id
// @desc    get messages
// @access  private
router.get("/:toId", auth, async (req, res) => {
  try {
    const user = await Message.findOne({ user: req.user.id });

    let to = user.to.filter((to) => to.id.toString() === req.params.toId);

    if (to.length > 0) {
      return res.json(to[0].messages);
    }

    return res.send(to);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route   GET api/message/:id
// @desc    send messages
// @access  private
router.post("/:toId", auth, async (req, res) => {
  try {
    if (req.params.toId === req.user.id) {
      return res.json({ msg: "cannot send to yourself" });
    }

    let mesRetreived = await Message.findOne({ user: req.user.id });

    const message = {
      text: req.body.text,
    };

    if (!mesRetreived) {
      mesRetreived = new Message({
        user: req.user.id,
        to: [
          {
            id: req.params.toId,
            messages: [message],
          },
        ],
      });
    } else {
      let exist = false;
      mesRetreived.to.forEach((to) => {
        if (to.id.toString() === req.params.toId) {
          to.messages.unshift(message);
          exist = true;
          return;
        }
      });

      if (!exist) {
        mesRetreived.to.unshift({
          id: req.params.toId,
          messages: [message],
        });
      }
    }

    mesRetreived.save();
    res.json(mesRetreived);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
