const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
require("dotenv").config();

// Registration Controller
const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      userModel.createUser(username, hashedPassword, (err) => {
          if (err) {
            console.log(err)
              return res.status(500).json({ message: 'Database error' });
          }
          res.status(201).json({ message: 'User registered successfully' });
      });
  } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { username, password } = req.body;

  userModel.findUserByUsername(username, async (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    res.status(200).json({ message: 'Login successful', user: { username: user.username } });
  });
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard')
    }
    return res.redirect('/')
  });
};

module.exports = { register, login, logout };
