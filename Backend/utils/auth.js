const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const getUserFromToken = (token) => {
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};

module.exports = {
  generateToken,
  verifyToken,
  getUserFromToken
};
