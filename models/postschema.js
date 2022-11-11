const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    _id : false , 
    postId: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },

    description: {
      type: String,
      require: true,
      max: 50,
    },

    likes: {
      type: Array,
      default: [],
    },
    unlikes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = postSchema;
