const mongoose = require('mongoose');
const path = require('path')
const chalk = require('chalk');
const hagen = require("hagen").default;
// //console.log('inside mongoose')
//console.log(path.resolve(__dirname, '../dev.env'))
// require('dotenv').config();
const config = require('config')
const MONGO_PATH = config.get('MONGO_PATH')
console.log(MONGO_PATH)
// console.log(process.env.MONGODB_URL)
mongoose.connect(MONGO_PATH)
  // console.log(process.env.MONGODB_URL_ATLAS)
  // mongoose.connect(process.env.MONGODB_URL_ATLAS, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true

  // })
  .then(() => hagen.success('MongoSuccess', chalk.bgBlueBright.whiteBright.underline.bold('Connected to MongoDB...')))
  .catch(err => hagen.error('MongoError', chalk.bgRed.whiteBright.underline.bold('Could not connect to MongoDB...')));