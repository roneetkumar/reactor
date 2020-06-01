const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.middleware");
const User = require("../../models/User.model");
const Message = require("../../models/Message.model");
const axios = require('axios');


// @route   GET api/message/:id
// @desc    get messages
// @access  private
router.get("/:toId", auth, async (req, res) => {
  try {
    const toUser = await Message.findOne({ user: req.user.id });
    const fromUser = await Message.findOne({ user: req.params.toId });

    let fromMessages = [];
    let toMessages = [];

    //check if toUser exist
    if (toUser) {
      toMessages = toUser.to.filter((to) => to.id.toString() === req.params.toId);
    }
    //check if fromUser exist
    if (fromUser) {
      fromMessages = fromUser.to.filter((to) => to.id.toString() === req.user.id);
    }
    //create empty object
    const messages = { user: null, friend: null }


    if (fromMessages.length != 0) {
      messages.user = fromMessages[0]
    }
    if (toMessages.length != 0) {
      messages.friend = toMessages[0]
    }

    return res.send(messages);
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

    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/message/:id
// @desc    send messages
// @access  private
router.delete("/:friendId/:id", auth, async (req, res) => {
  try {
    const user = await Message.findOne({ user: req.user.id });

    user.to.filter(to => {
      if (to.id.toString() === req.params.friendId) {
        to.messages = to.messages.filter(message => message._id.toString() !== req.params.id
        )
      }
    })

    user.save()

    res.status(200).json({ 'msg': "message successfully deleted" })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
