const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is missing" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Bearer token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? "Invalid token" : 
                      err.name === 'TokenExpiredError' ? "Token expired" : 
                      "Token not valid";

      return res.status(403).json({ error: message });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };