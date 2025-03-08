import { HotelOwner } from "../../models/hotels/hotelOwner.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const registerHotelOwner = asyncHandler(async (req, res) => {
//     // Get the bussinessName and bussinessRegNo from the request body
//     const { bussinessName, bussinessRegNo } = req.body;

//     if (!bussinessName || !bussinessRegNo) {
//         throw new ApiError(400, "Please provide a business name and business registration number");
//     }
//     // Check if the user exists
//     const user = await User.findById(req.user.id);
//     if (!user) {
//         throw new ApiError(404, "User not found");
//     }

//     // Check if the user is already a hotel owner
//     const hotelOwner = await HotelOwner.findOne({ user: req.user.id });

//     if (hotelOwner) {
//         throw new ApiError(400, "User is already a hotel owner");
//     }

//     // Create a new hotel owner
//     const newHotelOwner = await HotelOwner.create({
//         user: req.user.id,
//         bussinessName,
//         bussinessRegNo,
//         isApproved: false
//     });

//     // Send the response
//     res.status(201).json(new ApiResponser(201, newHotelOwner, "Hotel owner registered successfully"));
// });
const registerHotelOwner = asyncHandler(async (req, res) => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const { name, email, password, businessName, businessRegNo } = req.body;
    const bussinessName = businessName;
    const bussinessRegNo = businessRegNo;
    // console.log(req.body);

    const otp = Math.floor(Math.random() * 10000);
    if (!name || !email || !password || !bussinessName || !bussinessRegNo) {
        throw new ApiError(400, "All fields are required");
    }
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

    const hotelOwnerObj = await HotelOwner.create({
        name,
        email,
        bussinessName,
        bussinessRegNo,
        otp,
        isApproved: false,
        isVerifiedOtp: false,
        password: hashedPAssword,
    });

    res
        .status(201)
        .json(new ApiResponse(201, hotelOwnerObj, "Hotel Owner registered successfully"));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const SECRET_KEY = process.env.SECRET_KEY;
    const { email, otp } = req.body;

    const hotelOwner = await HotelOwner.findOne({ email });

    if (!hotelOwner) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    if (hotelOwner.isVerifiedOtp) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "User already verified"));
    }

    if (hotelOwner.otp !== otp) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid OTP"));
    }

    hotelOwner.isVerifiedOtp = true;
    await hotelOwner.save();

    const token = jwt.sign({ hotelOwner }, SECRET_KEY);

    res
        .status(200)
        .json(new ApiResponse(200, token, "Hotel owner verified successfully"));
});

const logineHotelOwner = asyncHandler(async (req, res) => {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const { email, password } = req.body;
    // console.log(req.body);

    if (!email || !password) {
        throw new ApiError(400, "Both email and password are required");
    }
    const hotelOwner = await HotelOwner.findOne({ email: email });
    const otp = Math.floor(Math.random() * 10000);

    if (!hotelOwner) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    // console.log(hotelOwner, "hotelOwner");
    const isMatch = await bcrypt.compare(password, hotelOwner?.password);

    if (!isMatch) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid credentials"));
    }

    if (!hotelOwner.isVerifiedOtp) {
        hotelOwner.otp = otp;
        await hotelOwner.save();
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
            html: `
            <html>
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

    const token = jwt.sign({ hotelOwner }, process.env.SECRET_KEY);

    res.status(200).json(new ApiResponse(200, token, "Login successful"));
});

const getHotelOwner = asyncHandler(async (req, res) => {
    const owners = await HotelOwner.find()

    if (!owners) {
        throw new ApiError(404, "No hotel found.")
    }

    return res.status(200).json(new ApiResponse(200, owners, "Hotel Owner fetched successfully."))
});

const getUnapprovedHotelOwner = asyncHandler(async (req, res) => {
    const owners = await HotelOwner.find({ isApproved: false })

    if (!owners) {
        throw new ApiError(404, "No hotel found.")
    }

    return res.status(200).json(new ApiResponse(200, owners, "Hotel Owner fetched successfully."))
});

const approveHotelOwner = asyncHandler(async (req, res) => {
    // Get the hotel owner
    const hotel_id = req.body;
    if (!hotel_id) {
        throw new ApiError(400, "Please provide a hotel owner id");
    }
    const hotelOwner = await HotelOwner.findById(req.params.id);

    if (!hotelOwner) {
        throw new ApiError(404, "Hotel owner not found");
    }

    // Update the hotel owner
    hotelOwner.isApproved = true;
    await hotelOwner.save();

    // Send the response
    res.status(200).json(new ApiResponser(200, hotelOwner, "Hotel owner approved successfully"));
});

const rejectHotelOwner = asyncHandler(async (req, res) => {
    const { hotelId } = req.body
    if (!hotelId) {
        throw new ApiError(404, "Hotel owner id not found.")
    }
    const owner = await HotelOwner.findById(hotelId)

    if (!owner) {
        throw new ApiError(404, "Hotel Owner not found")
    }
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });


    const mailOptions = {
        from: smtpUser,
        to: owner.email, // Replace with recipient email
        subject: "Your Registration Was Not Approved - BookinHub",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2 style="color: #e74c3c;">Registration Not Approved</h2>
            <p>Dear User,</p>
            <p>We appreciate your interest in <strong>BookinHub</strong>. However, after reviewing your registration request, we regret to inform you that it has not been approved by our admin team.</p>
            <p>If you believe this is a mistake or need further clarification, please contact our support team.</p>
            <a href="mailto:support@bookinhub.com" style="display: inline-block; padding: 10px 15px; background: #e74c3c; color: white; text-decoration: none; border-radius: 5px;">Contact Support</a>
            <p style="margin-top: 20px; color: #555;">Best regards,<br><strong>BookinHub Support Team</strong></p>
            </div>
        `,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });

    await owner.deleteOne()

    return res.status(200).json(new ApiResponse(200, null, "Hotel Owner rejected successfully."))
})

export { logineHotelOwner, registerHotelOwner, approveHotelOwner, rejectHotelOwner, getHotelOwner, getUnapprovedHotelOwner, verifyOtp };