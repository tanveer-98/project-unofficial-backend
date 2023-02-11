const Joi = require("joi");
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: new Date()
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoPublicId: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { versionKey: false });

const Video = mongoose.model("Video", videoSchema);

function validateVideo(video) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(5).max(1024).required(),
    videoUrl: Joi.string().required(),
    videoPublicId: Joi.string().required(),
  });

  return schema.validate(video);
}

function validateVideoPatch(video) {
  const schema = Joi.object({
    _id: Joi.string(),
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(5).max(1024),
    videoUrl: Joi.string(),
    videoPublicId: Joi.string().required(),
  });

  return schema.validate(video);
}


exports.Video = Video;
exports.validateVideo = validateVideo;
exports.validateVideoPatch = validateVideoPatch;