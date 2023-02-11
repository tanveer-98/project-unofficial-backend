const express = require("express");
const router = express.Router();
const { AboutUs, validateAboutUsPatch, validateAboutUs } = require("../models/aboutUs");
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')

router.get("/", async (req, res) => {
  // FEED FOUND
  const found = await AboutUs.findOne();

  if (found) return res.status(200).send({ aboutUs: found });

  // NOT FOUND
  return res.status(404).send({
    error: "404",
    message: "AboutUs not Found",
  });
});


router.patch("/", [auth, admin], async (req, res) => {
  // console.log(req.body)
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "400",
      message: "Body cannot be empty",
    });

  // VALIDATE


  const found = await AboutUs.findOne();
  if (!found) {
    const { error } = validateAboutUs(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let newAboutUs = new AboutUs(req.body);
    await newAboutUs.save();
    return res.status(200).send({aboutUs: newAboutUs});
  }

  const { error } = validateAboutUsPatch(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const updatedFind = await AboutUs.findOneAndUpdate(
    { _id: req.body._id, isDeleted: false },
    req.body,
    { new: true }
  );

  if (updatedFind == null)
    return res.status(404).send({
      error: "404",
      message: "AboutUs not Found",
    });

  return res.status(200).send({aboutUs: updatedFind});
});


module.exports = router;
