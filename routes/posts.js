const express = require("express");
const router = express.Router();
const { Post, validatePost, validatePostPatch } = require("../models/post");
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

router.get("/", async (req, res) => {
  // FEED FOUND
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const count = await Post.countDocuments();
  const sortedPost = await Post.find({ isDeleted: false }).sort({ sortedBy: -1 }).skip((page - 1) * limit).limit(limit);
  if (sortedPost) return res.status(200).send({ posts: sortedPost, count });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Posts not Found",
  });
});

router.get("/:id", async (req, res) => {
  // FEED FOUND
  const found = await Post.findOne({ _id: req.params.id,isDeleted: false });

  if (found) return res.status(200).send({ post: found });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Post not Found",
  });
});

router.post("/", [auth, admin], async (req, res) => {
  // console.log(req.body)
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  // VALIDATE
  const { error } = validatePost(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;
  let newPost = new Post({...data, sortedBy: new Date()});

  //SAVE
  try {
    await newPost.save();
    const find = await Post.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
    const count = await Post.countDocuments();
    // console.log("test")
    return res.status(200).send({ posts: find, new: newPost, count })
  } catch (err) {
    return res.status(400).send({
      error: "400",
      message: `${err.message}`,
    });
  }
});

router.patch("/", [auth, admin], async (req, res) => {
  // console.log(req.body)
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const { error } = validatePostPatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const updatedFind = await Post.findOneAndUpdate(
    { _id: req.body._id, isDeleted: false },
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "Post not Found",
    });

  // send all documents
  const count = await Post.countDocuments();
  const findAll = await Post.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
  return res.status(200).send({ posts: findAll, new: updatedFind, count });
});

// DELETE

router.post("/delete", [auth, admin], async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const { _id } = req.body;

  const deleted = await Post.findOneAndUpdate({ _id: _id, isDeleted: false }, {
    isDeleted: true
  });

  if (deleted == null)
    return res.status(404).send({
      error: "404",
      message: "Post not Found",
    });

  // send all documents

  const findAll = await Post.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
  const count = await Post.countDocuments();

  return res.status(200).send({posts: findAll, deleted: deleted, count});
});


module.exports = router;