const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const { UserInputError } = require('apollo-server');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validator');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    {expiresIn: '1h'}
  );
}

module.exports = {
  Mutation: {
    async register(parent, {registerInput: { username, email, password, confirmPassword }}, context, info) {
      // validate user input
      const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      // make sure user does not exist
      const user = await User.findOne({username});
      if (user) {
        throw new UserInputError('Username is taken', {errors: {username: 'This username is taken'}})
      }
      // hash password
      password = await bcrypt.hash(password, 12)

      const newUser = new User({
        email,
        password,
        username,
        createdAt: new Date().toISOString()
      });

      const result = await newUser.save();

      //create an authtoken
      const token = generateToken(result);

      return {
        ...result._doc,
        id: result._id,
        token
      }
    },

    async login(parent, { username, password }){
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError('Errors', { errors })
      }
      const user = await User.findOne({username});
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong Credentials'
        throw new UserInputError('Wrong Credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      }
    }
  }
}