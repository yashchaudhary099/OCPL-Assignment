const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
// const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

// function for sending mail

async function sendVerificationMail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email From OCPL",
      otp
    );

    console.log("Email Send Successfully", mailResponse);
  } catch (error) {
    console.log("Error occure while sending mail", error);
  }
}

OTPSchema.pre("save", async function (next) {
  sendVerificationMail(this.email, this.otp);
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;