# NodeJS Sample Setup

### Create s sample `index.js`
```js
// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

// MongoDB connection
const dbURI = process.env.MONGO_URI; // Replace with your MongoDB connection string
mongoose.connect(dbURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// MongoDB User Schema and Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Endpoints
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

app.get("/addUser", async (req, res) => {
    const { name, email } = req.query;

    if (!name || !email) {
        return res.status(400).send("Name and email are required");
    }

    try {
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).send("User added successfully");
    } catch (err) {
        res.status(500).send("Error adding user");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
```

### Create a sample `test.js`
```js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./index'); // Your server file must use module.exports.

const { expect } = chai;
chai.use(chaiHttp);

// Tests
describe('User API Tests', () => {

    describe('GET /addUser', () => {
        it('should add a user successfully with valid name and email', done => {
            chai.request(app)
                .get('/addUser')
                .query({ name: `${Date.now()}John Doe`, email: `${Date.now()}john.doe@example.com` })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.text).to.equal('User added successfully');
                    done();
                });
        });

        it('should fail when name or email is missing', done => {
            chai.request(app)
                .get('/addUser')
                .query({ name: 'Jane Doe' }) // Missing email
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.text).to.equal('Name and email are required');
                    done();
                });
        });
    });

    describe('GET /users after adding users', () => {
        it('should return a list of users', done => {
            chai.request(app)
                .get('/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.greaterThan(3); // One user added earlier
                    done();
                });
        });
    });
});
```

### Create `package.json`
```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "npx mocha test.js",
    "start": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "chai": "^4.0.0",
    "chai-http": "^4.0.0",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "mocha": "^10.0.0",
    "mongoose": "^8.9.2",
    "nodemon": "^3.1.9",
    "supertest": "^7.0.0"
  }
}
```

### Installing Dependencies

```
npm install
```

### Running Server
```bash
npm start
```

### Running tests
```bash
npm run test
```

### Adding .gitignore before pushing to repository
```bash
.env
/node_modules
```

### Create Repository on github and push this code to github