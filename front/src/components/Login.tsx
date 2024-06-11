import React, { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/all.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isOtpRequired, setIsOtpRequired] = useState<boolean>(false);
  const { setAuthState } = useContext(AuthContext);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ access_token: string }>('http://localhost:5000/api/user/login', {
        email,
        password,
        otp, // Include OTP field in the request body
      });

      const { access_token } = response.data;

      localStorage.setItem('accessToken', access_token);
      // Assuming your AuthContext provides a function setAuthenticated() to update the authentication state
      setAuthState({
        isAuthenticated: true,
        token: access_token,
        user: null, // Update this value as needed based on your AuthContext
      });
      setMessage('Login successful!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className='login'>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {/* Include OTP field if required */}
         
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
