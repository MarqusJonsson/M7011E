import express from 'express';
// Middleware
import bodyParser from 'body-parser';
import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
// GraphQL
//import { GraphQLSchema } from 'graphql';
//import { graphqlHTTP } from 'express-graphql';
//import { RootQuery } from './db/schemas/root/queries';
//import { RootMutation } from './db/schemas/root/mutations';
//const schema = new GraphQLSchema({ query: RootQuery, mutation: RootMutation });
// Setup server
const PORT = process.env.SIMULATOR_SERVER_PORT;
const app = express();
// Setup middleware
app.use(bodyParser.json());
app.use(cors(['http://localhost:3002', 'http://localhost:4200']));
//app.use('/graphiql', graphqlHTTP({ schema: schema, graphiql: true }));
app.use(errorHandler);
// Start server
app.listen(PORT, () => console.log(`Simulator server listening on port ${PORT}`));