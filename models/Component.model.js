const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ComponentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "profile",
  },
  downloadedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
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

  size: {
    type: String,
    // required: true,
  },
  creator: {

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
  url: {
    type: String,
    required: true
  }
});

module.exports = Component = mongoose.model("component", ComponentSchema);


// let profile = await Profile.findOne({
//   user: req.user.id,
// })
//   .populate("profilePicture")
//   .populate("user", ["name", "type"]);
// console.log(profile);
// const newPost = new Post({
//   text: req.body.text,
//   name: profile.user.name,
//   profilePicture: profile.profilePicture,
//   user: req.user.id,
// });