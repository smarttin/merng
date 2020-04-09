const postResolvers = require('./postResolvers');
const userResolvers = require('./userResolver');

module.exports = {
  Query: {
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation
  }
}

