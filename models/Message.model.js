const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  to: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      messages: [
        {
          text: {
            type: String,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  ],
  // },
});

module.exports = Message = mongoose.model("message", MessageSchema);
