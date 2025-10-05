import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';

export default function AdminLogin({ onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setError('');
      navigate('/admin');
      onClose();
    } else {
      setError('Invalid credentials');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="login-modal-overlay" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="login-header">
          <h2 className="login-title">Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label className="login-label">Email</label>
            <input
              className="login-field"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="login-field-group">
            <label className="login-label">Password</label>
            <div className="login-password-wrapper">
              <input
                className="login-field login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="login-password-toggle" onClick={togglePassword}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="login-options">
            <label className="login-checkbox-label">
              <input type="checkbox" className="login-checkbox" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} />
              <span className="login-checkbox-text">Keep me signed in</span>
            </label>
            <a href="#" className="login-forgot">Forgot password?</a>
          </div>
          {error && <p className="login-error">{error}</p>}
          <div className="login-social">
            <button type="button" className="social-button facebook">Facebook</button>
            <button type="button" className="social-button gmail">Gmail</button>
          </div>
          <button type="submit" className="login-submit">Sign in</button>
        </form>
      </motion.div>
    </motion.div>
  );
}