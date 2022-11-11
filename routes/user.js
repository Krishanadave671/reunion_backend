const User = require("../models/userschema");
const express = require("express");
const auth = require("../middlewares/auth");
const userrouter = express.Router();

userrouter.post("/api/follow/:userid", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    if (currentUser.userId !== req.params.userid) {
      const user = await User.findOne({ userId: req.params.userid });
      if (!user.followers.includes(currentUser.userId)) {
        await user.updateOne({ $push: { followers: currentUser.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.userid },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } else {
      res.status(403).json("you cannot follow yourself");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

userrouter.post("/api/unfollow/:userid", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    if (currentUser.userId !== req.params.userid) {
      const user = await User.findOne({ userId: req.params.userid });
      if (user.followers.includes(currentUser.userId)) {
        await user.updateOne({ $pull: { followers: currentUser.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.userid },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you don't follow this user");
      }
    } else {
      res.status(403).json("you cannot unfollow yourself");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

userrouter.get("/api/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    let nooffollowers = user.followers.length;
    let nooffollowings = user.followings.length;
    let userName = user.userId;
    res.status(200).json({userName ,  nooffollowers, nooffollowings });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = userrouter;
