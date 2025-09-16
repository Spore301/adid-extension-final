import React, { useState } from 'react';
import { loginUser } from './api';
// --- 1. Import the eye icons ---
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // --- 2. Add state to toggle password visibility ---
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const userData = await loginUser(email, password);
      onLoginSuccess(userData);
    } catch (err) {
      if (err.message === 'SERVER_ASLEEP') {
        setError("Server is waking up... Please try again in 30 seconds.");
      } else {
        setError(err.message || "An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="branding">
          <img src="/icons/logo.svg" alt="ADID Logo" className="logo" />
          <span className="company-name">ADID Taskmanager</span>
      </div>
      <h3>Welcome Back!</h3>
      <p className="subtitle">Enter your details to log in.</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={isLoading}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          {/* --- 3. The input and icon are now wrapped in a div --- */}
          <div className="password-input-wrapper">
            <input
              // --- 4. The type is now dynamic ---
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {/* --- 5. The clickable icon --- */}
            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </span>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;