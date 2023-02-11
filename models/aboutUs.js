const Joi = require("joi");
const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: new Date()
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  aboutUsImageUrl: {
    type: String,
    required: true,
  },
  aboutUsImagePublicId: {
    type: String,
    required: true,
  },
}, { versionKey: false });

const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

function validateAboutUs(aboutUs) {
  const schema = Joi.object({
    description: Joi.string().min(5).max(1024).required(),
    aboutUsImageUrl: Joi.string(),
    aboutUsImagePublicId: Joi.string(),
  });

  return schema.validate(aboutUs);
}

function validateAboutUsPatch(aboutUs) {
  const schema = Joi.object({
    _id: Joi.string().required(),
    description: Joi.string().min(5).max(1024),
    aboutUsImageUrl: Joi.string(),
    aboutUsImagePublicId: Joi.string(),
  });

  return schema.validate(aboutUs);
}


exports.AboutUs = AboutUs;
exports.validateAboutUs = validateAboutUs;
exports.validateAboutUsPatch = validateAboutUsPatch;