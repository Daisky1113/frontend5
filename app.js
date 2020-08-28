const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')
const schema = require('./Schema/schema')
require('dotenv').config()

const app = express()
const PORT = 4000
mongoose.connect(process.env.MONGODB_URL)
mongoose.connection.once('open', () => {
  console.log('connect mongoDB')
})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

app.listen(PORT, () => {
  console.log(`listenning on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Hello World')
})