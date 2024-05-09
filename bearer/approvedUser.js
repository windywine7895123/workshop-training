const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
require('dotenv').config();
const approvedUser = async (req, res, next) => {
    // Extract the JWT token from the Authorization header
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }
    try {
        // Verify the JWT token
        const decoded = jwt.verify(token.split("Bearer ")[1], process.env.SECRET_KEY);
        // Retrieve the user information from the database using the user ID from the token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        // Check user is aprrove
        if (user.isApproved !== true) {
            return res.status(403).json({ message: 'Insufficient permissions. User does not approve. Please wait admin to approve you' });
        }

        // Attach the user object to the request for use in subsequent route handlers
        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = approvedUser;
