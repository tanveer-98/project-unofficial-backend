const Joi = require("joi");
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
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
  imageUrl: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { versionKey: false });

const Image = mongoose.model("Image", imageSchema);

function validateImage(image) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(5).max(1024).required(),
    imageUrl: Joi.string().required(),
    imagePublicId: Joi.string().required(),
  });

  return schema.validate(image);
}

function validateImagePatch(image) {
  const schema = Joi.object({
    _id: Joi.string().required(),
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(5).max(1024),
    imageUrl: Joi.string().required(),
    imagePublicId: Joi.string().required(),
  });

  return schema.validate(image);
}


exports.Image = Image;
exports.validateImage = validateImage;
exports.validateImagePatch = validateImagePatch;