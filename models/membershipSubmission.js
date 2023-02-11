const Joi = require("joi");
const mongoose = require("mongoose");

const membershipSubmissionSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: new Date()
  },
  values: {
    type: Array,
    default: []
  }
}, { versionKey: false });

const MembershipSubmission = mongoose.model("MembershipSubmission", membershipSubmissionSchema);

exports.MembershipSubmission = MembershipSubmission;