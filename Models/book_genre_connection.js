const mongoose = require('mongoose')
const Schema = mongoose.Schema

const book_genre_connection_Schema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
  genreId: { type: Schema.Types.ObjectId, ref: 'Genre' }
})

module.exports = mongoose.model("Book_Genre", book_genre_connection_Schema)