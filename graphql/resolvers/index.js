const postResolver = require('./postResolver');
const userResolver = require('./userResolver');
const commentsResolver = require('./commentsResolver');

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...postResolver.Query
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
    ...commentsResolver.Mutation
  },
  Subscription: {
    ...postResolver.Subscription
  }
}

