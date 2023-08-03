// Import required modules
const jwt = require('jsonwebtoken');
const  adminModel = require('../model/registrationmodel'); // Replace with your actual user model

// Middleware function for verifying JWT and populating req.user
const authenticateToken = (req, res, next) => {
  const token = req.params;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, process.env.secretKey, async (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    try {
      // Fetch the user from the database based on the decoded token
      const user = await adminModel.findById(decodedToken.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Populate the req.user object with the authenticated user's information
      req.user = { userId: user._id,  token: token };
      next();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

module.exports = { authenticateToken };
