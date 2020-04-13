const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');


module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({createdAt: -1});
        return posts
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Post not found')
        }
        return post;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context){
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        username: user.username,
        user: user.id,
        createdAt: new Date().toISOString()
      })

      const post = await newPost.save();
      
      context.pubsub.publish('NEW_POST', {
        newPost: post
      })

      return post;
    },

    async deletePost(_, { postId }, context){
      const user = checkAuth(context);
      
      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return 'Post Deleted Successfuly'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(_, { postId }, context){
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // post already, liked unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // post not liked, like it
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save();
        return post;
      } else throw new UserInputError('Post not found')
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
}