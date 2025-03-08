import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setErrorMessage('Both email and password are required.');
      return;
    }

    try {
        const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, { email, password });
        if(response.data.message==="Login successful"){
            Cookies.set('token', response.data.data);
            window.location.href = "http://localhost:5173/";
        }
    } catch (error) {
        if(error.response.data.message==="User not verified"){
            navigate("/otp/" + email);
        }
        else{
            
            setErrorMessage("Enter valid credentials");
            alert("Enter valid credentials");
        }
    }
    setErrorMessage('');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className='login-btn'>Login</button>
      </form>
    </div>
  );
};

export default Login;
