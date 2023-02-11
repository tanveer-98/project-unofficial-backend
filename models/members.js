const Joi = require("joi");
const mongoose = require("mongoose");

const membersSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique : true
  },
   constituency: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
   candidateName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    unique: true
  },
  symbol:{
    type : String ,
    required : true, 
  },
  photo:{
    type : String ,
    required : true, 
  },
  isDeleted:{
    type : Boolean ,
    default :false
  }
},{versionKey:false});

const Members = mongoose.model("Member", membersSchema);

function validateMembers(member) {
  const schema = Joi.object({
    constituency: Joi.string().min(3).max(50).required(),
    candidateName: Joi.string().min(3).max(255).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    symbol: Joi.string().required(),
    photo : Joi.string().required()
  });

  return schema.validate(member);
}

function validateMembersPatch(member) {
  const schema = Joi.object({
    id:Joi.number().required(),
    constituency: Joi.string().min(3).max(50),
    candidateName: Joi.string().min(3).max(255),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/),
    symbol : Joi.string(),
    photo : Joi.string()
  });
  return schema.validate(member);
  }
  

exports.Members = Members;
exports.validate = validateMembers;
exports.validatePatch = validateMembersPatch;
