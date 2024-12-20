## Installing Docker

### Install docker 
For ubuntu: https://docs.docker.com/engine/install/ubuntu/
For windows: https://www.docker.com/products/docker-desktop/

### Pull Postgres
```
docker pull postgres
```

### Run Postgres
```
docker run --name postgres-container -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

```

### Create a sample project

- Install Dependencies
```
npm install express pg
```

- Create Server
```js
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
```

### Check Postgres After both API testing
```bash
docker exec -it postgres-container psql -U admin -d postgres
```

### Check then for users table
```bash
SELECT * FROM users;
```