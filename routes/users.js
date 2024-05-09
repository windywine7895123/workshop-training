var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');
const adminRequire = require('../bearer/adminRequire')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secretKey = process.env.SECRET_KEY


// Route for user registration
router.post('/register', async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ 
            status:400,
            message: 'Username already exists' });
      }
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
      // Create a new user with hashed password
      const newUser = new User({
          username,
          password: hashedPassword,
          firstname,
          lastname,
          role:"users",
          isApproved: false
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json({
        status:201,
        message:"register successfully",
        data:{savedUser}
      });
  } catch (error) {
      res.status(400).json({ 
        status:400,
        message: error.message });
  }
});

router.post('/registerAdmin',adminRequire, async (req, res) => {
  const { username, password, firstname, lastname } = req.body;

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ 
            status:400,
            message: 'Username already exists' });
      }
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
      // Create a new user with hashed password
      const newUser = new User({
          username,
          password: hashedPassword,
          firstname,
          lastname,
          role:"admin",
          isApproved:true
      });

      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json({
        status:201,
        message:'register admin successfully',
        data:{savedUser}
      });
  } catch (error) {
      res.status(400).json({ 
        status:400,
        message: error.message });
  }
});


// Route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Find the user by username
      const user = await User.findOne({ username });

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ 
            status:404,
            message: 'User not found,Please register' });
      }

      // Compare the provided password with the hashed password stored in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
          return res.status(401).json({ 
            status:401,
            message: 'Invalid credentials' });
      }

      // If password matches, generate a JSON Web Token (JWT) for authentication
      const token = jwt.sign({ userId: user._id ,username:user.username, role: user.role}, `${secretKey}`, { expiresIn: '1h' });
      // Return the token and user information (you may choose not to include sensitive data)
      res.json({ token, user: { username: user.username, firstname: user.firstname, role:user.role },loginStatus:'success'});
  } catch (error) {
      res.status(500).json({ 
        status:500,
        message: error.message });
  }
});

// Route to approve a user by ID
router.put('/approve/:id',adminRequire, async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update the user's isApproved field to true
    user.isApproved = true;
    const updatedUser = await user.save();

    res.status(200).json({ 
      status:200,
      message: 'User approved successfully', 
      data: {userid:updatedUser._id}});
  } catch (error) {
    res.status(500).json({ 
      status:500,
      message: error.message });
  }
});

module.exports = router;
