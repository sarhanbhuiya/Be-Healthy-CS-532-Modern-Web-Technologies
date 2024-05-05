// const mongoose = require('mongoose')

// // const Schema = mongoose.Schema;
// // const PostSchema = new Schema({
// //   title: {
// //     type: String,
// //     required: true
// //   },
// //   body: {
// //     type: String,
// //     required: true
// //   },
// //   createdAT: {
// //     type: Date,
// //     default: Date.now
// //   },
// //   updatedAT: {
// //     type: Date,
// //     default: Date.now
// //   },
// // });

// const Schema = mongoose.Schema;
// const PostSchema = new Schema({
//   email: {
//     type: String,
//     required: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   age: {
//     type: Number,
//     required: true
//   },
//   gender: {
//     type: String
//   },
//   health: {
//     type: Number,
//     min: 1,
//     max: 10
//   },
//   hours_sleep: {
//     type: Number
//   },
//   stress_level: {
//     type: Number,
//     min: 1,
//     max: 10
//   },
//   weight: {
//     type: Number
//   },
//   target_weight: {
//     type: Number
//   },
//   height: {
//     type: Number
//   },
//   body_fat_percentage: {
//     type: Number
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Post', PostSchema)