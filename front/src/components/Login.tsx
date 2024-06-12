import React, { useState, useContext, FormEvent } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Импортируем Link
import '../styles/login.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
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
        <h2>Вход</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
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
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="remember-forgot-container">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Запомнить меня</label>
            </div>
            <a href="#" className="forgot-password">Забыли пароль?</a>
          </div>
          <div className="form-group otp">
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Введите OTP ключ"
              required
            />
            <p>*Введите OTP ключ из приложения Google Authenticator</p>
          </div>
          <button type="submit">Войти</button>
        </form>
        <div className='form-registration'>
          <p>Ещё нет аккаунта?</p>
          <Link to="/register" className="register-link">Зарегистрируйтесь</Link>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
