const jwt = require('jsonwebtoken');

// Secret key for signing and verifying tokens
const secretKey = process.env.JWT_SECRET_KEY;

// Generate a JWT
const generateToken = (payload) => {
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
};

// Verify a JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

// Example usage

// Generate a token
const payload = { userId: 123, username: 'john.doe' };
const token = generateToken(payload);
console.log('Generated token:', token);

// TODO: to Implement tests in NOIDEJS
// Test1: Verify a token
// const decodedToken = verifyToken(token);
// if (decodedToken) {
  // console.log('Decoded token:', decodedToken);
// }

module.exports= { generateToken, verifyToken }
