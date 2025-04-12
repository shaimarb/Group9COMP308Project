import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

const resolvers = {
  Query: {
    currentUser: (_, __, context) => {
      const { req } = context;
      if (!req || !req.cookies) return null;

      const token = req.cookies.token;
      if (!token) return null;

      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role
        };
      } catch (error) {
        console.error("Error verifying token:", error);
        return null;
      }
    },

    getUserById: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) throw new Error('User not found');
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        };
      } catch (error) {
        console.error("Error retrieving user:", error);
        throw new Error('Unable to fetch user');
      }
    }
  },

  Mutation: {
    login: async (_, { username, password }, { res }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error('Invalid password');

      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        config.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    },

    register: async (_, { username, email, password, role }) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) throw new Error('Username already exists');

        const user = new User({
          username,
          email,
          password,
          role
        });

        await user.save();
        return true;
      } catch (error) {
        console.error("Registration error:", error);
        throw new Error("Registration failed");
      }
    }
  }
};

export default resolvers;
