import { Flight } from "../../models/flight/flightSchema.model.js";
import {ApiResponse} from "../../utils/apiResponse.js";
import { FlightAdmin } from "../../models/flight/flightAdmin.modle.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
const registerOwner = async (req, res) => {
  try {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;
    const { name, email, password, mobile, gender, airlineName } = req.body;
    const hashedPAssword = await bcrypt.hash(password, 10);
    const otp = Math.floor(Math.random() * 10000);
    // Validation (Ensure required fields are provided)
    if (!name || !email || !password || !mobile || !gender || !airlineName) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Missing required fields"));
    }

    // Check if email already exists
    const userExists = await FlightAdmin.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email already exists"));
    }

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
          subject: "BookinHub OTP", // subject line
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
          }
        });

    // Create a new flight document
    const newFlightAdmin = new FlightAdmin({
      full_name: name,
      email,
      password:hashedPAssword,
      mobile,
      gender,
      airline_name:airlineName,
      isApproved: false,
      otp,
      isVerifiedOtp: false,
    });

    // Save to the database
    await newFlightAdmin.save();

    res
      .status(201)
      .json(new ApiResponse(201, req.body, "Flight added successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error, "Error adding flight"));
  }
};

const otpVerification = async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await FlightAdmin.findOne({ email });
  
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
    res
      .status(200)
      .json(new ApiResponse(200, user, "User verified successfully"));
}

const addFlight = async (req, res) => {
  try {
    const { flight_name, airline_name, number_of_seats, status } = req.body;

    // Validation (Ensure required fields are provided)
    if (
      !flight_name ||
      !airline_name ||
      !number_of_seats ||
      !flight_duration ||
      !status
    ) {
      return res
        .status(400)
        .json(ApiResponse(400, null, "Missing required fields"));
    }

    // Create a new flight document
    const newFlight = new Flight({
      flight_name,
      airline_name,
      number_of_seats,
      status,
    });

    // Save to the database
    await newFlight.save();

    res
      .status(201)
      .json(ApiResponse(201, newFlight, "Flight added successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error adding flight"));
  }
};

const updateFlight = async (req, res) => {
  try {
    const { flight_id } = req.params;
    const { flight_name, airline_name, number_of_seats, status } = req.body;

    // Validation (Ensure required fields are provided)
    if (
      !flight_name ||
      !airline_name ||
      !number_of_seats ||
      !flight_duration ||
      !status
    ) {
      return res
        .status(400)
        .json(ApiResponse(400, null, "Missing required fields"));
    }

    // Check if flight exists
    const flightExists = await Flight.findById(flight_id);
    if (!flightExists) {
      return res.status(404).json(ApiResponse(404, null, "Flight not found"));
    }

    // Update flight details
    flightExists.flight_name = flight_name;
    flightExists.airline_name = airline_name;
    flightExists.number_of_seats = number_of_seats;
    flightExists.status = status;

    // Save to the database
    await flightExists.save();

    res
      .status(200)
      .json(ApiResponse(200, flightExists, "Flight updated successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error updating flight"));
  }
};

const deleteFlight = async (req, res) => {
  try {
    const { flight_id } = req.params;

    // Check if flight exists
    const flightExists = await Flight.findById(flight_id);
    if (!flightExists) {
      return res.status(404).json(ApiResponse(404, null, "Flight not found"));
    }

    // Delete the flight
    await Flight.findByIdAndDelete(flight_id);

    res.status(200).json(ApiResponse(200, null, "Flight deleted successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error deleting flight"));
  }
};

const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res
      .status(200)
      .json(ApiResponse(200, flights, "Flights fetched successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error fetching flights"));
  }
};

const addClass = async (req, res) => {
  try {
    const { class_name, flight_id, amount, discount, max_seat } = req.body;

    // Validate required fields
    if (!class_name || !flight_id || !amount || !max_seat) {
      return res
        .status(400)
        .json(ApiResponse(400, null, "Missing required fields"));
    }

    // Check if flight exists
    const flightExists = await Flight.findById(flight_id);
    if (!flightExists) {
      return res.status(404).json(ApiResponse(404, null, "Flight not found"));
    }

    // Create class details
    const newClass = new ClassDetails({
      class_name,
      flight_id,
      amount,
      discount: discount || 0, // Default discount is 0 if not provided
      max_seat,
    });

    await newClass.save();

    res
      .status(201)
      .json(ApiResponse(201, newClass, "Class added successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error adding class"));
  }
};

const getClass = async (req, res) => {
  try {
    const classes = await ClassDetails.find();
    res
      .status(200)
      .json(ApiResponse(200, classes, "Classes fetched successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error fetching classes"));
  }
};

const updateClass = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { class_name, flight_id, amount, discount, max_seat } = req.body;

    // Validation (Ensure required fields are provided)
    if (!class_name || !flight_id || !amount || !max_seat) {
      return res
        .status(400)
        .json(ApiResponse(400, null, "Missing required fields"));
    }

    // Check if class exists
    const classExists = await ClassDetails.findById(class_id);
    if (!classExists) {
      return res.status(404).json(ApiResponse(404, null, "Class not found"));
    }

    // Update class details
    classExists.class_name = class_name;
    classExists.flight_id = flight_id;
    classExists.amount = amount;
    classExists.discount = discount;
    classExists.max_seat = max_seat;

    // Save to the database
    await classExists.save();

    res
      .status(200)
      .json(ApiResponse(200, classExists, "Class updated successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error updating class"));
  }
};

const deleteClass = async (req, res) => {
  try {
    const { class_id } = req.params;

    // Check if class exists
    const classExists = await ClassDetails.findById(class_id);
    if (!classExists) {
      return res.status(404).json(ApiResponse(404, null, "Class not found"));
    }

    // Delete the class
    await ClassDetails.findByIdAndDelete(class_id);

    res.status(200).json(ApiResponse(200, null, "Class deleted successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error deleting class"));
  }
};

const addSchedule = async (req, res) => {
  try {
    const {
      flight_id,
      departure_station,
      destination_station,
      departure_time,
      arrival_time,
      gate_number,
      duration,
    } = req.body;

    // Validate required fields
    if (
      !flight_id ||
      !departure_station ||
      !destination_station ||
      !departure_time ||
      !arrival_time ||
      !duration
    ) {
      return res
        .status(400)
        .json(ApiResponse(400, null, "Missing required fields"));
    }

    // Check if flight exists
    const flightExists = await Flight.findById(flight_id);
    if (!flightExists) {
      return res.status(404).json(ApiResponse(404, null, "Flight not found"));
    }

    // Create flight schedule
    const newSchedule = new Schedule({
      flight_id,
      departure_station,
      destination_station,
      departure_time,
      arrival_time,
      duration,
      gate_number: gate_number || "Not Assigned", // Default if not provided
    });

    await newSchedule.save();

    res
      .status(201)
      .json(ApiResponse(201, newSchedule, "Schedule added successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error adding schedule"));
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const {
      flight_id,
      departure_station,
      destination_station,
      departure_time,
      arrival_time,
      gate_number,
      duration,
    } = req.body;

    // Check if schedule exists
    const scheduleExists = await Schedule.findById(schedule_id);
    if (!scheduleExists) {
      return res.status(404).json(ApiResponse(404, null, "Schedule not found"));
    }

    // Update schedule details
    scheduleExists.flight_id = flight_id;
    scheduleExists.departure_station = departure_station;
    scheduleExists.destination_station = destination_station;
    scheduleExists.departure_time = departure_time;
    scheduleExists.arrival_time = arrival_time;
    scheduleExists.duration = duration;
    scheduleExists.gate_number = gate_number;

    // Save to the database
    await scheduleExists.save();

    res
      .status(200)
      .json(ApiResponse(200, scheduleExists, "Schedule updated successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error updating schedule"));
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    // Check if schedule exists
    const scheduleExists = await Schedule.findById(schedule_id);
    if (!scheduleExists) {
      return res.status(404).json(ApiResponse(404, null, "Schedule not found"));
    }

    // Delete the schedule
    await Schedule.findByIdAndDelete(schedule_id);

    res
      .status(200)
      .json(ApiResponse(200, null, "Schedule deleted successfully"));
  } catch (error) {
    res.status(500).json(ApiResponse(500, error, "Error deleting schedule"));
  }
};

export {
  addFlight,
  getFlights,
  addClass,
  addSchedule,
  updateFlight,
  deleteFlight,
  getClass,
  updateClass,
  deleteClass,
  updateSchedule,
  deleteSchedule,
  registerOwner,
  otpVerification
};
