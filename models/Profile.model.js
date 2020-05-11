const mongoose = require("mongoose");
const extendSchema = require("mongoose-extend-schema");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  location: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  followings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],

  downloaded: [
    {
      component: {
        type: Schema.Types.ObjectId,
        ref: "component",
      },
    },
  ],
});

const DevProfile = extendSchema(ProfileSchema, {
  website: {
    type: String,
  },

  status: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
  },

  githubusername: {
    type: String,
  },

  expirence: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  links: [
    {
      label: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
    },
  ],
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
module.exports = DevProfile = mongoose.model("devProfile", DevProfile);
