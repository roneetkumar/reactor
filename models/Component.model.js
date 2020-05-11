const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ComponentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  name: {
    type: String,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    required: true,
  },

  ratings: [
    {
      description: {
        type: String,
      },
      stars: {
        type: Number,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  downloads: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  creator: {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "profile",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
  },
});

module.exports = Component = mongoose.model("component", ComponentSchema);
