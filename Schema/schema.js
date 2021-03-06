const graphql = require('graphql')
const Author = require('../Models/author')
const Book = require('../Models/book')
const User = require('../Models/user')
const Review = require('../Models/review')
const Genre = require('../Models/genre')
const Book_Genre_Connection = require('../Models/book_genre_connection')

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema
} = graphql

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent) {
        return Book.find({ authorId: parent.id })
      }
    }
  }),
})

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(paernt) {
        return Author.findById(paernt.authorId)
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      async resolve(parent, args) {
        const book_genre = await Book_Genre_Connection.find({ bookId: parent.id }).populate('genreId')
        return book_genre.map(el => el.genreId)
      }
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent) {
        return Review.find({ bookId: parent.id })
      }
    }
  }),
})

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent) {
        return Review.find({ userId: parent.id })
      }
    }
  })
})

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    book: {
      type: BookType,
      resolve(parent) {
        return Book.findById(parent.bookId)
      }
    },
    user: {
      type: UserType,
      resolve(parent) {
        return User.findById(parent.userId)
      }
    }
  })
})

const GenreType = new GraphQLObjectType({
  name: "Genre",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent) {
        const connection = await Book_Genre_Connection.find({ genreId: parent.id }).populate('bookId')
        return connection.map(el => el.bookId)
      }
    }
  })
})

const Book_Genre_ConnectionType = new GraphQLObjectType({
  name: "Book_Genre",
  fields: () => ({
    id: { type: GraphQLID },
    bookId: { type: GraphQLID },
    genreId: { type: GraphQLID }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Author.findById(args.id)
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        return Author.find({})
      }
    },
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Book.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return Book.find({})
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return User.findById(args.id)
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({})
      }
    },
    review: {
      type: ReviewType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Review.findById(args.id)
      }
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve() {
        return Review.find({})
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      resolve() {
        return Genre.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        const author = new Author({
          name: args.name
        })
        return author.save()
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Author.findByIdAndUpdate(args.id, Object.assign({}, args), { new: true })
      }
    },
    deleteAuthor: {
      type: AuthorType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Author.findByIdAndDelete(args.id)
      }
    },
    addBook: {
      type: BookType,
      args: {
        authorId: { type: GraphQLID },
        name: { type: GraphQLString }
      },
      resolve(paernt, args) {
        return new Book(Object.assign({}, args)).save()
      }
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Book.findByIdAndUpdate(args.id, Object.assign({}, args), { new: true })
      }
    },
    deleteBook: {
      type: BookType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Book.findByIdAndDelete(args.id)
      }
    },
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return new User(Object.assign({}, args)).save()
      }
    },
    addReview: {
      type: ReviewType,
      args: {
        bookId: { type: GraphQLNonNull(GraphQLID) },
        userId: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        body: { type: GraphQLString }
      },
      resolve(parent, args) {
        return new Review(Object.assign({}, args)).save()
      }
    },
    addGenre: {
      type: GenreType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args) {
        const g = new Genre(Object.assign({}, args))
        console.log(g)
        return new Genre(Object.assign({}, args)).save()
      }
    },
    updateGenre: {
      type: GenreType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Genre.findByIdAndUpdate(args.id, Object.assign({}, args), { new: true })
      }
    },
    deleteGenre: {
      type: GenreType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Genre.findByIdAndDelete(args.id)
      }
    },
    addBookGenreConnection: {
      type: Book_Genre_ConnectionType,
      args: {
        bookId: { type: GraphQLNonNull(GraphQLID) },
        genreId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return new Book_Genre_Connection({
          bookId: args.bookId,
          genreId: args.genreId
        }).save()
      }
    }
  },

})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})