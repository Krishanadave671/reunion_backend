const express = require("express");
const User = require("../models/userschema");
const auth = require("../middlewares/auth");
const { default: mongoose } = require("mongoose");
const e = require("express");
const postSchema = require("../models/postschema");
const postrouter = express.Router();

postrouter.post("/api/post", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const post = {
      postId: new mongoose.Types.ObjectId().toHexString(),
      title: req.body.title,
      description: req.body.description,
      createdAt: new Date().toISOString(),
    };
    user.posts.push(post);
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

postrouter.delete("/api/post/:postid", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const post = user.posts.find((post) => post.postId === req.params.postid);
    console.log(post);
    if (post) {
      await user.updateOne({ $pull: { posts: { postId: req.params.postid } } });
      res.status(200).json("post has been deleted");
    } else {
      res.status(403).json("you don't have this post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

postrouter.post("/api/like/:postid", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const posteduser = await User.findOne({
      "posts.postId": req.params.postid,
    });
    const post = await posteduser.posts.find(
      (post) => post.postId === req.params.postid
    );
    if (post) {
      console.log(
        !post.likes.includes(user.userId) && !post.unlikes.includes(user.userId)
      );
      if (
        !post.likes.includes(user.userId) &&
        !post.unlikes.includes(user.userId)
      ) {
        await User.updateOne(
          { "posts.postId": req.params.postid },
          { $push: { "posts.$.likes": user.userId } },
          { new: true }
        );
        res.status(200).json("you liked the post ");
      } else {
        res.status(403).json("you already like this post");
      }
    } else {
      res.status(403).json("such post doesn't exist !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
postrouter.post("/api/unlike/:postid", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const posteduser = await User.findOne({
      "posts.postId": req.params.postid,
    });
    const post = await posteduser.posts.find(
      (post) => post.postId === req.params.postid
    );
    if (post) {
      if (
        !post.likes.includes(user.userId) &&
        !post.unlikes.includes(user.userId)
      ) {
        let userl = await User.updateOne(
          { "posts.postId": req.params.postid },
          { $push: { "posts.$.unlikes": user.userId } },
          { new: true }
        );
        console.log(userl);
        res.status(200).json("you unliked the post");
      } else {
        res.status(403).json("you already unlike this post");
      }
    } else {
      res.status(403).json("such post doesn't exist !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

postrouter.post("/api/comment/:postid", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const posteduser = await User.findOne({
      "posts.postId": req.params.postid,
    });
    const post = await posteduser.posts.find(
      (post) => post.postId === req.params.postid
    );
    if (post) {
      const comment = {
        commentId: new mongoose.Types.ObjectId().toHexString(),
        comment: req.body.comment,
      };
      await User.updateOne(
        { "posts.postId": req.params.postid },
        { $push: { "posts.$.comments": comment } },
        { new: true }
      );
      res.status(200).json(comment.commentId);
    } else {
      res.status(403).json("such post doesn't exist !");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

postrouter.get("/api/posts/:postid", async (req, res) => {
  const posteduser = await User.findOne({ "posts.postId": req.params.postid });
  const post = await posteduser.posts.find(
    (post) => post.postId === req.params.postid
  );
  if (post) {
    let nooflikes = post.likes.length;
    let noofunlikes = post.unlikes.length;
    let allcomments = post.comments;
    return res.status(200).json({ post, nooflikes });
  } else {
    return res.status(403).json("post doesn't exist");
  }
});


postrouter.get("/api/all_posts" , auth , async(req,res) => {
    const userposts = await User.aggregate([
      {"$unwind": "$posts"},
      {"$sort" : {"posts.createdAt" : -1}},
      {"$project" : {
        "posts.postId" : 1,
        "posts.title" : 1,
        "posts.description" : 1,
        "posts.createdAt" : 1,
        "posts.likes" : 1,
        "posts.comments" : 1
      }},
    ])
    return res.status(200).json(userposts); 
})
module.exports = postrouter; 