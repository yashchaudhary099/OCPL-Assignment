const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const { signup, login, sendOTP } = require("../controllers/Auth");

// Routes for Login, Signup, and Authentication

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP);

module.exports = router;