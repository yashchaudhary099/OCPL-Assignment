const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  createCustomers,
  getAllCustomers,
} = require("../controllers/Customers");

const { auth } = require("../middlewares/auth");

// Route for create new customer
router.post("/customers", auth, createCustomers);

// Route for get all list of customers
router.get("/customers", auth, getAllCustomers);

module.exports = router;