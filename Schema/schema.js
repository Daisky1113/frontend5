const graphql = require('graphql')
const Author = require('../Models/author')
const Book = require('../Models/book')

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
  }),
})

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  }),
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
        name: { type: GraphQLString }
      },
      resolve(paernt, args) {
        return new Book({ name: args.name }).save()
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
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})