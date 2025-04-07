import { Flight } from "../../models/flight/flightSchema.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Schedule } from "../../models/flight/schedule.model.js";
import { FlightAdmin } from "../../models/flight/flightAdmin.modle.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
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
        res
          .status(500)
          .json(new ApiResponse(500, error, "Error sending email"));
      }
    });

    // Create a new flight document
    const newFlightAdmin = new FlightAdmin({
      full_name: name,
      email,
      password: hashedPAssword,
      mobile,
      gender,
      airline_name: airlineName,
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
  const token = jwt.sign({ user }, process.env.SECRET_KEY);
  res
    .status(200)
    .json(new ApiResponse(200, token, "User verified successfully"));
};

const loginOwner = async (req, res) => {
  const otp = Math.floor(Math.random() * 10000);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const { email, password } = req.body;

  const user = await FlightAdmin.findOne({ email });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  if (!user.isVerifiedOtp) {
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
        res
          .status(500)
          .json(new ApiResponse(500, error, "Error sending email"));
      }
    });

    return res
      .status(400)
      .json(new ApiResponse(400, null, "User not verified"));
  }

  if (!user.isApproved) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User not approved"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json(new ApiResponse(401, null, "Invalid password"));
  }

  const token = jwt.sign({ user }, process.env.SECRET_KEY);

  res.status(200).json(new ApiResponse(200, token, "Login successful"));
};

const addFlight = async (req, res) => {
  try {
    const {
      route,
      flightNo,
      flight_name,
      economy_seats,
      business_seats,
      first_class_seats,
      economy_price,
      business_price,
      first_class_price,
      departure,
      arrival,
      status,
      gate_number,
    } = req.body;

    const departure_satation = route.split("-")[0].trim();
    const destination_station = route.split("-")[1].trim();

    // Check if flight already exists
    let existingFlight = await Flight.findOne({ flightNo });
    if (existingFlight) {
      const newSchedule = new Schedule({
        flight_id: existingFlight._id,
        departure_station: departure_satation,
        destination_station: destination_station,
        departure_time: departure,
        arrival_time: arrival,
        duration: calculateDuration(departure, arrival),
        gate_number,
        economy_price,
        business_price,
        first_class_price,
        status,
      });

      const savedSchedule = await newSchedule.save();

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            savedSchedule,
            "Flight and schedule created successfully"
          )
        );
    }

    // Create a new flight
    const newFlight = new Flight({
      flight_name,
      number_of_seats:
        parseInt(economy_seats) +
        parseInt(business_seats) +
        parseInt(first_class_seats),
      flightNo,
      economy_seats,
      business_seats,
      first_class_seats,
    });

    const savedFlight = await newFlight.save();

    // Create a schedule for the flight
    const newSchedule = new Schedule({
      flight_id: savedFlight._id,
      departure_station: departure_satation,
      destination_station: destination_station,
      departure_time: departure,
      arrival_time: arrival,
      duration: calculateDuration(departure, arrival),
      gate_number,
      economy_price,
      business_price,
      first_class_price,
      status,
    });

    const savedSchedule = await newSchedule.save();

    res.status(201).json({
      message: "Flight and schedule created successfully",
      flight: "savedFlight",
      schedule: "savedSchedule",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const calculateDuration = (departure, arrival) => {
  const departureTime = new Date(departure);
  const arrivalTime = new Date(arrival);
  const diffMs = arrivalTime - departureTime;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMins}m`;
};

const updateFlight = async (req, res) => {
  try {
    const { id, departureTime, arrivalTime, from, to } = req.body;

    // Validation (Ensure required fields are provided)
    if (!id || !departureTime || !arrivalTime || !from || !to) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Missing required fields"));
    }

    // Check if flight exists
    const flightExists = await Schedule.findById(id);
    if (!flightExists) {
      return res.status(404).json(new ApiResponse(404, null, "Flight not found"));
    } else {
      const departuretime = flightExists.departure_time;
      const dateWithoutTimeDeparture = departuretime.split("T")[0];
      const newDepartureTime = `${dateWithoutTimeDeparture}T${departureTime.slice(
        0,
        5
      )}`;

      const arrivaltime = flightExists.arrival_time;
      const dateWithoutTimeArrival = arrivaltime.split("T")[0];
      const newArrivalTime = `${dateWithoutTimeArrival}T${arrivalTime.slice(
        0,
        5
      )}`;

      // Update the flight
      const updatedFlight = await Schedule.findByIdAndUpdate(
        id,
        {
          departure_time: newDepartureTime,
          arrival_time: newArrivalTime,
          departure_station: from,
          destination_station: to,
        },
        { new: true }
      );
      if (!updatedFlight) {
        return res.status(404).json(new ApiResponse(404, null, "Flight not found"));
      }

      res
        .status(200)
        .json(new ApiResponse(200, updatedFlight, "Flight updated successfully"));
    }
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error, "Error updating flight"));
  }
};

const cancleFlight = async (req, res) => {
  try {
    const { id } = req.body;

    // Check if flight exists
    const flightExists = await Schedule.findById(id);
    if (!flightExists) {
      return res.status(404).json(new ApiResponse(404, null, "Flight not found"));
    }

    // Cancel the flight
    flightExists.status = "Canceled";
    flightExists.save();

    res
      .status(200)
      .json(new ApiResponse(200, flightExists, "Flight canceled successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error, "Error canceling flight"));
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight_id = req.params.id;

    // Check if flight exists
    const flightExists = await Schedule.findById(flight_id);
    if (!flightExists) {
      return res.status(404).json(new ApiResponse(404, null, "Flight not found"));
    }

    // Delete the flight
    await Schedule.findByIdAndDelete(flight_id);

    res.status(200).json(new ApiResponse(200, null, "Flight deleted successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error, "Error deleting flight"));
  }
};

const getFlights = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("flight_id");

    const flightsData = schedules.map((schedule) => {
      const departureDateTime = new Date(schedule.departure_time);
      const arrivalDateTime = new Date(schedule.arrival_time);

      return {
        id: schedule._id,
        flightId: schedule.flight_id._id,
        flightNumber: schedule.flight_id.flightNo,
        flightName: schedule.flight_id.flight_name,
        departureDate: departureDateTime.toISOString().split("T")[0],
        departureTime: departureDateTime.toTimeString().split(" ")[0],
        arrivalDate: arrivalDateTime.toISOString().split("T")[0],
        arrivalTime: arrivalDateTime.toTimeString().split(" ")[0],
        from: schedule.departure_station,
        to: schedule.destination_station,
        status: schedule.status,
      };
    });

    res
      .status(200)
      .json(new ApiResponse(200, flightsData, "Flights fetched successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error, "Error fetching flights"));
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
  loginOwner,
  addFlight,
  getFlights,
  addClass,
  addSchedule,
  updateFlight,
  cancleFlight,
  deleteFlight,
  getClass,
  updateClass,
  deleteClass,
  updateSchedule,
  deleteSchedule,
  registerOwner,
  otpVerification,
};
