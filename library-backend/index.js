require("dotenv").config()
const { ApolloServer, gql, UserInputError } = require("apollo-server")
const { v1: uuid } = require("uuid")
const mongoose = require("mongoose")
const Author = require("./models/author")
const Book = require("./models/book")

const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      let response = books.slice()
      if (args.author) {
        response = books.filter((book) => book.author === args.author)
      }
      if (args.genre) {
        response = response.filter((book) => book.genres.includes(args.genre))
      }
      return response
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (root) => {
      return books.filter((book) => book.author === root.name).length
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const authorExists = await Author.findOne({ name: args.author })
      let book
      if (!authorExists) {
        const newAuthor = new Author({ name: args.author })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
        book = new Book({ ...args, author: newAuthor })
      } else {
        book = new Book({ ...args, author: authorExists })
      }

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book
    },
    editAuthor: (root, args) => {
      const authorExist = authors.find((author) => author.name === args.name)
      if (!authorExist) {
        return null
      }
      const updatedAuthor = { ...authorExist, born: args.setBornTo }
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author
      )
      return updatedAuthor
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
