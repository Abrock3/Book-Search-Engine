const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    user: async (parent, { userId }) => {
      const foundUser = await User.findOne({
        _id: userId,
      });
      if (foundUser) {
        return foundUser;
      }
      return;
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create({ ...args });
      if (user) {
        const token = signToken(user);
        return { token, user };
      } else {
        throw new AuthenticationError("Signup Failed");
      }
    },
    login: async (parent, { email, password }) => {
    
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { userId, bookToSave }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: bookToSave } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    deleteBook: async (parent, { bookId, userId }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      console.log(updatedUser);
      return updatedUser;
    },
  },
};

module.exports = resolvers;
