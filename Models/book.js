const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  name: String,
  authorId: { type: Schema.Types.ObjectId, ref: 'author' },
})

module.exports = mongoose.model('Book', bookSchema)