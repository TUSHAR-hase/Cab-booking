
import { Rider } from "../../models/Cabs/cab_rider_model.js";
import nodemailer from "nodemailer";
import express from 'express';
import bcrypt from 'bcrypt';
import {ApiResponse} from "../../utils/apiResponse.js"
import jwt from "jsonwebtoken";
const genarate_token =user=>{ 
  return jwt.sign({ id:user._id,role:user.role}, process.env.SECRET_KEY, {
  expiresIn: "5d",
})}

export const add_rider = async (req, resp) => {
  try {
      console.log('Register endpoint hit');
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASSWORD;
      const { email, password, name, conformpassword,licence_number, phone,address} = req.body;
      console.log('Request data:', req.body);
  const otp = Math.floor(Math.random() * 10000);


      let existingUser = await Rider.findOne({ email }) 

      if (existingUser) {
          return resp.status(400).json({ message: "User already exists" });
      }
      console.log("Plain Password:", password);
      // const hashedPassword = await bcrypt.hash(password.trim(), 10);
      // console.log("Hashed Password Before Storing:", hashedPassword);
     

       
      let user = null;
      const transporter = nodemailer.createTransport({
          service: "gmail", // You can also use SMTP server details directly
          auth: {
            user: smtpUser, // your email address
            pass: smtpPass, // your email password (use app-specific password for Gmail)
          },
        });
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
      user=new Rider({otp,  isVerifiedOtp: false,email, password, name, conformpassword,licence_number, phone,address})

      await user.save();
      return resp.status(201).json({ message: "User created successfully", user });

  } catch (error) {
      console.error(error);
      return resp.status(500).json({ message: "Error creating user", error });
  }
};
export const getRider = async (req, res) => {
    try {
        const Riders = await Rider.find();
        if (Riders) {
            res.status(200).json(Riders)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const getRidersByid = async (req, res) => {
    try {
        const rider = await Rider.findById(req.params.id)
        if (!rider) {
            res.status(500).json({ message: "Rider not found" })
        } else {
            res.status(200).json(rider)
        }
    } catch (error) {
        res.status(500).json(error)

    }
}
export const update_Rider = async (req, res) => {
    try {
        const updateRider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updateRider) return res.status(404).json({ message: "rider not found" });
        res.status(200).json(updateRider);
    } catch (error) {
        res.status(500).json(error)
    }
}
export const delate_Rider = async (req, res) => {
    try {
        const delateRider = await Rider.findByIdAndDelete(req.params.id)
        if (!delateRider) return res.status(404).json({ message: "Rider not found" });
        res.status(200).json({ message: "rider deleted successfully" });
    } catch (error) {
        res.status(500).json(error)
    }
}

export const verifyOtp = async (req, res) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  const { email, otp } = req.body;

  const user = await Rider.findOne({ email });
 
  
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
  const updatedUser = await Rider.findOne({ email }); // Double-check
  console.log("Updated User:", updatedUser);
  const token = jwt.sign({ user }, SECRET_KEY);

  res
    .status(200)
    .json(new ApiResponse(200, token, "Rider verified successfully"));
};

export const loginrider = async (req, res) => {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
      const { email, password } = req.body;
      console.log("Login attempt:", email); 
      const otp = Math.floor(Math.random() * 10000);

      let user = await Rider.findOne({ email }) 
               
        console.log(user)
      console.log("Stored Hashed Password:", user.password);
      console.log("Entered Password:", password);        
      if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
      }

    
      const isValidPassword = await bcrypt.compare(password, user.password);
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
              res.status(500).json(new ApiResponse(500, error, "Error sending email"));
            } else {
              return true;
            }
          });
    
        return res
          .status(400)
          .json({message: "User not verified"});
      }
      console.log("Password match:", isValidPassword);
      console.log(password.trim())
      const token = genarate_token(user);
      return res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
  }
};

