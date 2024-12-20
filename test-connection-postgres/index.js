const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL client configuration
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'password',
  database: 'postgres'
});

// Connect to PostgreSQL
client.connect();

// Create Users Table
client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  );
`, (err, res) => {
  if (err) {
    console.error('Error creating table:', err.stack);
  } else {
    console.log('Users table is ready.');
  }
});

// Route to list users
app.get('/users', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to add users
app.get('/add-user', async (req, res) => {
  const { name, email } = req.query;
  
  if (!name || !email) {
    return res.status(400).send('Name and email are required');
  }

  try {
    await client.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(200).send('User added successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
