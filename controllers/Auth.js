const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//send OTP

exports.sendOTP = async (req, res) => {
  try {
    // get data from body
    const { email } = req.body;

    // check existance of user
    const userExist = await User.findOne({ email });

    // validation
    if (userExist) {
      return res.status(401).json({
        success: false,
        message: "User is Already register, try with another account",
      });
    }

    // Generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP Generated", otp);

    //check otp is unique or not
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // entry of otp in DB

    const otpBody = await OTP.create(otpPayload);
    console.log("otpbody ", otpBody);

    // return response

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SignUp
exports.signup = async (req, res) => {
  try {
    // fetch data from body
    const { name, email, password, otp } = req.body;
    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("otp", otp);

    // validate
    if (!name || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "all fields are required",
      });
    }

    // they provide confirm password then i need to check it with password

    // check if user is alredy signup
    const alreadyUser = await User.findOne({ email });

    // validation
    if (alreadyUser) {
      return res.status(401).json({
        success: false,
        message: "User is Already register, try with another account",
      });
    }

    // find most recent otp
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(`Opt: ${recentOtp}`);

    //validate otp
    if (recentOtp.length == 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp != recentOtp.otp) {
      return res.status(403).json({
        success: false,
        message: "OTP not Match",
      });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create enrty in DB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered , please try again later",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // fetch data from body
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check for user
    const user = await User.findOne({ email });

    // validate
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not register , please signup first",
      });
    }

    // JWT token after password verification
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      user.token = token;
      user.password = undefined;

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // crerate a cookie
      res.cookie("token", token, option).status(200).json({
        success: true,
        message: "User login successfully",
        token,
        user,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "login failer, please try again later",
    });
  }
};