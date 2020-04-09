const { AuthenticationError } = require('apollo-server');
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
      // console.log(user);
      const newPost = new Post({
        body,
        username: user.username,
        user: user.id,
        createdAt: new Date().toISOString()
      })

      const post = await newPost.save();
      
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
    }
  }
}