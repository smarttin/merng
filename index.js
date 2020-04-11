const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");


const { DB_URI } = require("./config.js");
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to database!')
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`server running at ${res.url}`);
  })
  .catch(err => {
    console.log("Connection failed!", err);
  });
