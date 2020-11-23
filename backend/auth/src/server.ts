import express from 'express';
// Middleware
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

// Setup server
const PORT = process.env.SERVER_PORT;
const app = express();
// Setup middleware
app.use(bodyParser.json());
// Start server
app.listen(PORT, () => console.log(`Auth server listening on port ${PORT}`));