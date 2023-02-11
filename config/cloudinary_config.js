const cloudinary = require('cloudinary').v2;
const config = require("config");

const cloudinary_config = cloudinary.config({
  cloud_name: config.get("CLOUD_NAME"),
  api_key: config.get("CLOUDINARY_API_KEY"),
  api_secret: config.get("CLOUDINARY_API_SECRET"),
  secure: true
});

module.exports = cloudinary_config;