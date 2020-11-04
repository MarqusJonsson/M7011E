import express from 'express';
// Middleware
import bodyParser from 'body-parser';
import { cors } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
// Setup server
const PORT = process.env.SIMULATOR_SERVER_PORT;
const app = express();
// Setup middleware
app.use(bodyParser.json());
app.use(cors(['http://localhost:3002', 'http://localhost:4200']));
app.use(errorHandler);
// Start server
app.listen(PORT, () => console.log(`Simulator server listening on port ${PORT}`));