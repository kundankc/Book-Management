require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { getUserFromToken } = require('./utils/auth');
const User = require('./models/User');

const startServer = async () => {
  const app = express();

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const token1 = token.replace('Bearer ', '');

      const userId = getUserFromToken(token1);

      if (userId) {
        try {
          const user = await User.findById(userId);
          return { user };
        } catch (error) {
          return { user: null };
        }
      }
      
      return { user: null };
    }
  });

  await server.start();
  
  server.applyMiddleware({ app, path: '/api/graphql' });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
