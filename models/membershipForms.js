const Joi = require("joi");
const mongoose = require("mongoose");

const membershipFormSchema = new mongoose.Schema({
  dateCreated: {
    type: Date,
    default: new Date()
  },
  fields: {
    type: Array,
    default: [
      {
        name: "name",
        display: "Name",
        type: "name",
        validation: {required: true, min: 1, max: 128}
      },
      {
        name: "text",
        display: "Text",
        type: "text",
        validation: {required: true, min: 1, max: 128}
      },
      {
        name: "email",
        display: "Email",
        type: "email",
        validation: {required: true, min: 5, max: 128}
      },
      {
        name: "image",
        display: "Image",
        type: "imageUrl",
        validation: {required: false}
      },
      {
        name: "editorText",
        display: "Editor Text",
        type: "editor",
        validation: {required: false}
      },
      
    ]
  }
}, { versionKey: false });

const MembershipForm = mongoose.model("MembershipForm", membershipFormSchema);

exports.MembershipForm = MembershipForm;