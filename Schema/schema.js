const graphql = require('graphql')
const Author = require('../Models/author')
const Book = require('../Models/book')
const User = require('../Models/user')
const Review = require('../Models/review')


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
    authorId: { type: GraphQLID },
    name: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(paernt) {
        return Author.findById(paernt.authorId)
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
    name: { type: GraphQLString }
  })
})

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: { type: GraphQLID },
    bookId: { type: GraphQLID },
    userId: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString }
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
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})