const mongoose = require('mongoose')
const Schema = mongoose.Schema

const book_genre_connection_Schema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'book' },
  genreId: { type: Schema.Types.ObjectId, ref: 'genre' }
})

module.exports = mongoose.model("Book_Genre", book_genre_connection_Schema)