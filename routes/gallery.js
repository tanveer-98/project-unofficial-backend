const express = require("express");
const router = express.Router();
const { Image, validateImage, validateImagePatch } = require("../models/image");
const { Video, validateVideo, validateVideoPatch } = require("../models/video");

router.get("/image", async (req, res) => {
  // FEED FOUND
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const count = await Image.countDocuments();
  const sortedImage = await Image.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);

  if (sortedImage) return res.status(200).send({ images: sortedImage, count });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Images not Found",
  });
});

router.get("/image/:id", async (req, res) => {
  // FEED FOUND
  const found = await Image.findOne({ _id: req.params.id,isDeleted: false });

  if (found) return res.status(200).send({ image: found });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Image not Found",
  });
});

router.get("/video", async (req, res) => {
  // FEED FOUND
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const count = await Video.countDocuments();
  const sortedVideo = await Video.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);

  if (sortedVideo) return res.status(200).send({ videos: sortedVideo, count });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Videos not Found",
  });
});

router.get("/video/:id", async (req, res) => {
  // FEED FOUND
  const found = await Video.findOne({ _id: req.params.id,isDeleted: false });

  if (found) return res.status(200).send({ video: found });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "Video not Found",
  });
});

router.post("/image", async (req, res) => {
  // console.log(req.body)
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  // VALIDATE
  const { error } = validateImage(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;
  let newImage = new Image(data);

  //SAVE
  try {
    await newImage.save();
    const find = await Image.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
    const count = await Image.countDocuments();
    // console.log("test")
    return res.status(200).send({ images: find, new: newImage, count })
  } catch (err) {
    return res.status(400).send({
      error: "400",
      message: `${err.message}`,
    });
  }
});

router.post("/video", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  // VALIDATE
  const { error } = validateVideo(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const data = req.body;
  let newVideo = new Video(data);

  //SAVE
  try {
    await newVideo.save();
    const find = await Video.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
    const count = await Video.countDocuments();
    return res.status(200).send({ videos: find, new: newVideo, count })
  } catch (err) {
    return res.status(400).send({
      error: "400",
      message: `${err.message}`,
    });
  }
});

router.patch("/image", async (req, res) => {
  // console.log(req.body)
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const { error } = validateImagePatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const updatedFind = await Image.findOneAndUpdate(
    { _id: req.body._id, isDeleted: false },
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "Image not Found",
    });

  // send all documents
  const count = await Image.countDocuments();
  const findAll = await Image.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
  return res.status(200).send({ images: findAll, new: updatedFind, count });
});

router.patch("/video", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE
  const { error } = validateVideoPatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  const updatedFind = await Video.findOneAndUpdate(
    { _id: req.body._id, isDeleted: false },
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "Video not Found",
    });

  // send all documents
  const count = await Video.countDocuments();
  const findAll = await Video.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
  return res.status(200).send({ videos: findAll, new: updatedFind, count });
});

// DELETE

router.post("/image/delete", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const { _id } = req.body;

  const deleted = await Image.findOneAndUpdate({ _id: _id, isDeleted: false }, {
    isDeleted: true
  });

  if (deleted == null)
    return res.status(404).send({
      error: "404",
      message: "Image not Found",
    });

  // send all documents

  const findAll = await Image.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
  const count = await Image.countDocuments();

  return res.status(200).send({images: findAll, deleted: deleted, count});
});
module.exports = router;

router.post("/video/delete", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const { _id } = req.body;

  const deleted = await Video.findOneAndUpdate({ _id: _id, isDeleted: false }, {
    isDeleted: true
  });

  if (deleted == null)
    return res.status(404).send({
      error: "404",
      message: "Video not Found",
    });

  // send all documents

  const findAll = await Video.find({ isDeleted: false }).sort({ dateCreated: -1 }).skip((page - 1) * limit).limit(limit);
  const count = await Video.countDocuments();

  return res.status(200).send({videos: findAll, deleted: deleted, count});
});
module.exports = router;
