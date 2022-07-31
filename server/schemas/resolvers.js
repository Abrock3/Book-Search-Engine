const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    user: async (parent, { user = null, params }) => {
      const foundUser = await User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      });
      if (!foundUser) {
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
    saveBook: async (parent, { user, body }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return res.json(updatedUser);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
    },
    deleteBook: async (parent, { user, params }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Couldn't find user with this id!" });
      }
      return res.json(updatedUser);
    },
  },
};

module.exports = resolvers;
