// server/gateway.js
//
import dotenv from 'dotenv';

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//
const app = express();
dotenv.config();
// ✅ Fix: Add middleware to parse JSON requests
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Enable CORS and Cookie Parsing
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
}));
app.use(cookieParser());
// Configure the Apollo Gateway for microservices
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://localhost:4001/graphql' },
      { name: 'community', url: 'http://localhost:4002/graphql' },
    ],
  }),
});
// Initialize Apollo Server
const server = new ApolloServer({
  gateway,
  introspection: true,
});

async function startServer() {
  await new Promise(resolve => setTimeout(resolve, 5000));

  await server.start();
  // Apply Express middleware for Apollo Server
  
  app.use('/graphql', expressMiddleware(server));
  // Start Express server
  app.listen(4000, () => {
    console.log(`🚀 API Gateway ready at http://localhost:4000/graphql`);
  });
}
startServer();