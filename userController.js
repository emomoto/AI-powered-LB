const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const users = [];

const generateToken = (user) => {
  return jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' }); // Adjustment to store only username in the token
};

app.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    users.push(user);
    res.status(201).send('User created');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find(u => u.username === req.body.username);
  if (!user) {
    return res.status(400).json({ error: 'Cannot find user' });
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = generateToken(user);
      res.json({ token: token });
    } else {
      res.status(401).json({ error: 'Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/updateProfile', async (req, res) => {
  const { username, newPassword } = req.body;
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/validateToken', (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token is not valid' });
    }
    res.json({ user: user.username, message: 'Token is valid' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});