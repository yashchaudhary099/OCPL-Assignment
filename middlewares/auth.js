const jwt = require("jsonwebtoken");
require("dotenv").config();

// authorisation
exports.auth = async (req, res, next) => {
  try {
    // fetch token or get token
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // verify token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (err) {
      // verification issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "something went wrong , while validating the token",
    });
  }
};