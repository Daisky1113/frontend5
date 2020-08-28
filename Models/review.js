const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  bookId: { type: Schema.Types.ObjectId, ref: 'book' },
  title: { type: String },
  body: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("Review", reviewSchema)