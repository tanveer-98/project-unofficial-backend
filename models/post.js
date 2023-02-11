const Joi = require("joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: new Date()
  },
  sortedBy: {
    type: Number,
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
  postImageUrl: {
    type: String,
    required: true,
  },
  postImagePublicId: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { versionKey: false });

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(5).max(1024).required(),
    postImageUrl: Joi.string().required(),
    postImagePublicId: Joi.string().required(),
  });

  return schema.validate(post);
}

function validatePostPatch(post) {
  const schema = Joi.object({
    _id: Joi.string().required(),
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(5).max(1024),
    postImageUrl: Joi.string().required(),
    postImagePublicId: Joi.string().required(),
  });

  return schema.validate(post);
}


exports.Post = Post;
exports.validatePost = validatePost;
exports.validatePostPatch = validatePostPatch;