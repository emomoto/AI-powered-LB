const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(express.json());

const users = [];

const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    users.push(user);
    res.status(201).send('User created');
  } catch {
    res.status(500).send();
  }
});

app.post('/login', async (req, res) => {
  const user = users.find(u => u.username === req.body.username);
  if (user == null) {
    return res.status(400).send('Cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = generateToken(user);
      res.json({ token: token });
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});