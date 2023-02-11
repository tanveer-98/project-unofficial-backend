const Joi = require("joi");
const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  id: {
    type: Number,
    require: true,
    unique : true
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  subtext: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    minlength: 50,
    maxlength: 1024,
  },
  imageUrl:{
    type : String ,
    required : true, 
  },
  isDeleted :{
    type : Boolean,
    default: false
  },
  blurHash: {
    type: String,
    default: "LCIg+j00%}?J|nVtOr8^D#xDS%xH"
  },
  readmore : {
    type: String,
     required: true
  }
},{versionKey:false});

const Feed = mongoose.model("Feed", feedSchema);

function validateFeed(feed) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    subtext: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(50).max(1024).required(),
    imageUrl : Joi.string().required(),
    readmore : Joi.string().required(),
    blurHash: Joi.string()
  });

  return schema.validate(feed);
}

function validateFeedPatch(feed) {
    const schema = Joi.object({
      id: Joi.number().required(),
      title: Joi.string().min(3).max(50),
      subtext: Joi.string().min(3).max(255),
      description: Joi.string().min(50).max(1024),
      imageUrl : Joi.string(),
      readmore : Joi.string(),
      blurHash: Joi.string()
    });
  
    return schema.validate(feed);
  }
  

exports.Feed = Feed;
exports.validate = validateFeed;
exports.validatePatch = validateFeedPatch;
