const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new pool of connections for our database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

pool.on('connect', () => {
  console.log('Connected to the database');
});

// Export query function that returns a promise
const query = (text, params) => pool.query(text, params);

module.exports = { query };
