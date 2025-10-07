import React, { useState } from 'react';
import { loginUser } from './api';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
          />
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