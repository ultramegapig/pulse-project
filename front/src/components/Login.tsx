import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/all.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const { setAuthState } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      const decodedToken = JSON.parse(atob(access_token.split('.')[1]));
      
      localStorage.setItem('accessToken', access_token);
      setAuthState({
        token: access_token,
        user: decodedToken,
        isAuthenticated: true,
      });
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Login failed. Please check your credentials and try again.');
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
              placeholder="Введите электронную почту"
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
              placeholder="Введите пароль"
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
          <button type="submit">Вход</button>
        </form>
        <div className='form-registration'>
          <p>Нет аккаунта?</p>
          <a href="/register" className="register-link">Зарегистрируйтесь</a>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
