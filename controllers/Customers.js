const Customers = require("../models/Customers");
const User = require("../models/User");

// create customer handler function

exports.createCustomers = async (req, res) => {
  try {
    // fetch data from body
    const { name, contactNumber, address } = req.body;

    // validate data
    if (!name || !contactNumber || !address) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create new customer in DB
    const newCustomer = await Customers.create({
      name,
      contactNumber,
      address,
    });

    // rertun rsponse
    return res.status(200).json({
      success: true,
      message: "Customer create successfully",
      CustomerDetails: newCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create new customer",
      error: error.message,
    });
  }
};

// get all customers list handler

exports.getAllCustomers = async (req, res) => {
  try {
    // find all list
    const customerList = await Customers.find({});

    // return response
    return res.status(200).json({
      success: true,
      message: "fetching done",
      List: customerList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to fetch the customer details",
      error: error.message,
    });
  }
};