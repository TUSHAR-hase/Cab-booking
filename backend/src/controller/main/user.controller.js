import { User } from "../../models/main/user.models.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

import jwt from "jsonwebtoken";
import { booking } from "../../models/Cabs/cab_booking_model.js";

const registerUser = async (req, res) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const { name, gender, contact, email, type, password } = req.body;
  const otp = Math.floor(Math.random() * 10000);
  const key = Math.floor(Math.random() * 10000);


  const hashedPAssword = await bcrypt.hash(password, 10);

  // Create a transporter object using the default SMTP transport (Gmail in this case)
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can also use SMTP server details directly
    auth: {
      user: smtpUser, // your email address
      pass: smtpPass, // your email password (use app-specific password for Gmail)
    },
  });

  // Setup email data
  const mailOptions = {
    from: smtpUser, // sender address
    to: email, // list of recipients
    subject: "BookMyFlight OTP", // subject line
    // text: "Hello, this is a test email sent from Nodemailer!", // plain text body
    // Alternatively, you can send HTML body
    html: `<html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                padding: 20px;
            }}
            .container {{
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }}
            h2 {{
                color: #4CAF50;
            }}
            .otp-code {{
                font-size: 24px;
                font-weight: bold;
                color: #333;
                padding: 10px;
                background-color: #f1f1f1;
                border: 1px solid #ddd;
                text-align: center;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 30px;
            }}
            .footer a {{
                color: #4CAF50;
                text-decoration: none;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to BookinHub!</h2>
            <p>Thank you for registering with us! To complete your account creation process, please verify your email address by entering the One-Time Password (OTP) below:</p>
            <div class="otp-code">${otp}</div>
            <p>The OTP is valid for the next 10 minutes. Please enter it in the required field to complete your registration.</p>
            <p>If you did not request this, please disregard this email.</p>
            <div class="footer">
                <p>For any issues, feel free to contact our <a href="mailto:support@bookinhub.com">support team</a>.</p>
                <p>Thank you for choosing us!</p>
                <p>Best regards, <br> The BookinHub Team</p>
            </div>
        </div>
    </body>
    </html>`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).json(new ApiResponse(500, error, "Error sending email"));
    } else {
      return true;
    }
  });

  const user = await User.create({
    name,
    gender,
    contact,
    email,
    otp,
    key,
    type,
    isVerifiedOtp: false,
    password: hashedPAssword
  });

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
};

const verifyOtp = async (req, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  if (user.isVerifiedOtp) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already verified"));
  }

  if (user.otp !== otp) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
  }

  user.isVerifiedOtp = true;
  await user.save();

  const token = jwt.sign({ user }, SECRET_KEY);

  res
    .status(200)
    .json(new ApiResponse(200, token, "User verified successfully"));
};

const loginUser = async (req, res) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const otp = Math.floor(Math.random() * 10000);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }



  const isMatch = await bcrypt.compare(password, user.password);
  // console.log(user.passowrd)
  // console.log(password)

  // console.log(isMatch)
  if (!isMatch) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid credentials"));
  }

  if (!user.isVerifiedOtp) {
    user.otp = otp;
    await user.save();
    // Create a transporter object using the default SMTP transport (Gmail in this case)
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can also use SMTP server details directly
      auth: {
        user: smtpUser, // your email address
        pass: smtpPass, // your email password (use app-specific password for Gmail)
      },
    });

    // Setup email data
    const mailOptions = {
      from: smtpUser, // sender address
      to: email, // list of recipients
      subject: "BookMyFlight OTP", // subject line
      // text: "Hello, this is a test email sent from Nodemailer!", // plain text body
      // Alternatively, you can send HTML body
      html: `<html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f4;
                padding: 20px;
            }}
            .container {{
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: 0 auto;
            }}
            h2 {{
                color: #4CAF50;
            }}
            .otp-code {{
                font-size: 24px;
                font-weight: bold;
                color: #333;
                padding: 10px;
                background-color: #f1f1f1;
                border: 1px solid #ddd;
                text-align: center;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                font-size: 12px;
                color: #888;
                text-align: center;
                margin-top: 30px;
            }}
            .footer a {{
                color: #4CAF50;
                text-decoration: none;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to BookinHub!</h2>
            <p>Thank you for registering with us! To complete your account creation process, please verify your email address by entering the One-Time Password (OTP) below:</p>
            <div class="otp-code">${otp}</div>
            <p>The OTP is valid for the next 10 minutes. Please enter it in the required field to complete your registration.</p>
            <p>If you did not request this, please disregard this email.</p>
            <div class="footer">
                <p>For any issues, feel free to contact our <a href="mailto:support@bookinhub.com">support team</a>.</p>
                <p>Thank you for choosing us!</p>
                <p>Best regards, <br> The BookinHub Team</p>
            </div>
        </div>
    </body>
    </html>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res
          .status(500)
          .json(new ApiResponse(500, error, "Error sending email"));
      } else {
        return true;
      }
    });

    return res
      .status(400)
      .json(new ApiResponse(400, null, "User not verified"));
  }

  const token = jwt.sign({ user }, process.env.SECRET_KEY);

  res.status(200).json(new ApiResponse(200, token, "Login successful"));
};

export { registerUser, verifyOtp, loginUser };
export const getbookingByid = async (req, resp) => {
  try {
    if (!req.params.id) {
      return resp.status(400).json({ message: "user ID is required" });
    }

    const bookings = await booking.find({ user_id: req.params.id })
      .populate("Rider_id")

      .populate("vehicle_id");

    if (!bookings || bookings.length === 0) {
      return resp.status(404).json({ message: "Booking not found" });
    }

    resp.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    resp.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};