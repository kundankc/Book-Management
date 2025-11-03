const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { generateToken } = require('../utils/auth');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');

const resolvers = {
  Query: {
    getBooks: async () => {
      try {
        const books = await Book.find()
          .populate('addedBy')
          .sort({ createdAt: -1 });
        return books;
      } catch (error) {
        throw new Error('Failed to fetch books');
      }
    },

    getBook: async (_, { id }) => {
      try {
        const book = await Book.findById(id).populate('addedBy');
        if (!book) {
          throw new Error('Book not found');
        }
        return book;
      } catch (error) {
        throw new Error('Failed to fetch book');
      }
    }
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });

        if (existingUser) {
          throw new Error('User already exists ');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
          username,
          email,
          password: hashedPassword,
          role: 'user'
        });

        await user.save();

        const token = generateToken(user.id);

        return {
          token,
          user
        };
      } catch (error) {
        throw new Error(error.message || 'Registration failed');
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new AuthenticationError('Invalid credentials');
        }

        const token = generateToken(user.id);

        return {
          token,
          user
        };
      } catch (error) {
        throw new AuthenticationError('Login failed');
      }
    },

    addBook: async (_, { title, author, description }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a book');
      }

      try {
        const book = new Book({
          title,
          author,
          description,
          addedBy: context.user.id
        });

        await book.save();
        await book.populate('addedBy');

        return book;
      } catch (error) {
        throw new Error('Failed to add book');
      }
    },

    addReview: async (_, { bookId, rating, comment }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to add a review');
      }

      try {
        const book = await Book.findById(bookId);
        
        if (!book) {
          throw new Error('Book not found');
        }

        const review = new Review({
          rating,
          comment,
          bookId,
          userId: context.user.id
        });

        await review.save();

        return review;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to add review', error);
      }
    },

    deleteReview: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to delete a review');
      }

      try {
        const review = await Review.findById(id);

        if (!review) {
          throw new Error('Review not found');
        }

        const user = await User.findById(context.user.id);

        if (user.role !== 'admin' && review.userId.toString() !== context.user.id) {
          throw new ForbiddenError('You are not authorized to delete review');
        }

        await Review.findByIdAndDelete(id);

        return true;
      } catch (error) {
        throw new Error(error.message || 'Failed to delete review');
      }
    }
  },

  Book: {
    reviews: async (parent) => {
      try {
        return await Review.find({ bookId: parent.id });
      } catch (error) {
        return [];
      }
    }
  },

  Review: {
    user: async (parent) => {
      try {
        return await User.findById(parent.userId);
      } catch (error) {
        return null;
      }
    }
  }
};

module.exports = resolvers;
