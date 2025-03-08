import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // Step 3: Use useState hooks to manage form data
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("customer"); // Default type
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !gender || !contact || !email || !password || !type) {
      setError("All fields are required");
      return;
    }
    // Step 4: Create user data object
    const userData = {
      name,
      gender,
      contact,
      email,
      type,
      password
    };

    try {
      // Step 5: Make POST request to backend to register user
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, userData);
      if(response.data.statusCode === 201){
          navigate("/otp/" + email);
      }
      else{
        setError(response.data.message);
      }

      console.log(response.data);

    } catch (err) {
      setError("Error occurred during registration", err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contact:</label>
          <input
            type="number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="customer">Customer</option>
            {/* <option value="admin">Admin</option> */}
            <option value="hotelOwner">Hotel Owner</option>
            <option value="cabOwner">Cab Owner</option>
            <option value="flightOwner">Flight Owner</option>
          </select>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
