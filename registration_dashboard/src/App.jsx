import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

// --- Validation Logic (Moved from external file) ---

/**
 * Validates an email address.
 * @param {string} email - The email to validate.
 * @returns {string|null} - An error message string if invalid, otherwise null.
 */
const validateEmail = (email) => {
  if (!email) {
    return 'Email is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }
  return null;
};

/**
 * Validates a username.
 * @param {string} username - The username to validate.
 * @returns {string|null} - An error message string if invalid, otherwise null.
 */
const validateUsername = (username) => {
  if (!username) {
    return 'Username is required.';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters long.';
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores.';
  }
  return null;
};

/**
 * Validates a password based on specific criteria.
 * - Must be between 8 and 12 characters.
 * - Must contain at least one uppercase letter.
 * - Must contain at least one lowercase letter.
 * - Must contain at least one number.
 * - Must contain at least one special character.
 * @param {string} password - The password to validate.
 * @returns {string|null} - An error message string if invalid, otherwise null.
 */
const validatePassword = (password) => {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8 || password.length > 12) {
    return 'Password must be between 8 and 12 characters.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number.';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return null;
};


// --- React Components ---

// Define the base URL for your backend API
const API_URL = 'http://localhost:5000/api/auth';

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('register'); // Start on register tab
  const [message, setMessage] = useState({ type: '', content: '' });

  const clearMessage = () => {
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  return (
    <div className="bg-gray-900 font-sans text-white min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2070&auto=format&fit=crop')"}}>
      <div className="w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-xl border border-violet-500/30 rounded-xl p-8 shadow-2xl">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 text-sm font-medium text-center transition-colors duration-300 relative ${
                activeTab === 'login' ? 'text-violet-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
              {activeTab === 'login' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400" layoutId="underline" />}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 text-sm font-medium text-center transition-colors duration-300 relative ${
                activeTab === 'register' ? 'text-violet-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
              {activeTab === 'register' && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400" layoutId="underline" />}
            </button>
          </div>

          {/* Message Display Area */}
          <AnimatePresence>
            {message.content && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`flex items-center p-3 mb-4 rounded-lg text-sm ${
                  message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                }`}
              >
                {message.type === 'error' ? <AlertCircle className="mr-2 h-5 w-5"/> : <CheckCircle className="mr-2 h-5 w-5"/>}
                {message.content}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AnimatePresence handles the exit/enter animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'login' ? <LoginForm setMessage={setMessage} clearMessage={clearMessage} /> : <RegisterForm setMessage={setMessage} clearMessage={clearMessage} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; 2024 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// Reusable Input Field Component with Icon
const InputField = ({ id, name, type, placeholder, icon: Icon, value, onChange, error }) => (
    <div className="relative mb-2">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
      <input
        type={type}
        id={id}
        name={name}
        className={`w-full pl-10 pr-4 py-2 bg-gray-900/50 border rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-300 ${
          error 
            ? 'border-red-500/50 text-red-400 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-700 focus:ring-violet-500 focus:border-violet-500'
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <AnimatePresence>
          {error && (
              <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="mt-1 text-xs text-red-400"
              >
                  {error}
              </motion.p>
          )}
      </AnimatePresence>
    </div>
);

// Login Form Component
function LoginForm({ setMessage, clearMessage }) {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem('token', response.data.token);
      setMessage({ type: 'success', content: 'Login successful! Redirecting...' });
      
      setTimeout(() => {
        window.location.href = 'http://localhost:5175/'; // Adjust this URL as needed
      }, 1500);

    } catch (error) {
      setMessage({ type: 'error', content: error.response?.data?.message || 'Login failed.' });
      clearMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField id="email-login" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleChange} />
      <InputField id="password-login" name="password" type="password" placeholder="••••••••" icon={Lock} value={formData.password} onChange={handleChange} />
      
      <div className="flex items-center justify-between text-sm pt-2">
        <div className="flex items-center">
          <input id="remember" name="remember" type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-violet-600 focus:ring-violet-500" />
          <label htmlFor="remember" className="ml-2 text-gray-400">Remember me</label>
        </div>
        <a href="#" className="font-medium text-violet-400 hover:text-violet-300">Forgot password?</a>
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-violet-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 transition-colors duration-300 !mt-6">
        Sign In
      </motion.button>
    </form>
  );
}

// Registration Form Component with Validation
function RegisterForm({ setMessage, clearMessage }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
      let error = null;
      if (name === 'username') error = validateUsername(value);
      if (name === 'email') error = validateEmail(value);
      if (name === 'password') error = validatePassword(value);
      setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Run all validations one last time before submitting
    const usernameError = validateUsername(formData.username);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (usernameError || emailError || passwordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
      });
      setMessage({ type: 'error', content: 'Please fix the errors before submitting.' });
      clearMessage();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      setMessage({ type: 'success', content: response.data.message });
      setFormData({ username: '', email: '', password: '' }); // Clear form on success
      setErrors({}); // Clear errors
      clearMessage();
    } catch (error) {
      setMessage({ type: 'error', content: error.response?.data?.message || 'Registration failed.' });
      clearMessage();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField id="username-register" name="username" type="text" placeholder="Choose a username" icon={User} value={formData.username} onChange={handleChange} error={errors.username} />
      <InputField id="email-register" name="email" type="email" placeholder="you@example.com" icon={Mail} value={formData.email} onChange={handleChange} error={errors.email} />
      <InputField id="password-register" name="password" type="password" placeholder="Create a password" icon={Lock} value={formData.password} onChange={handleChange} error={errors.password} />

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-violet-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 transition-colors duration-300 !mt-6">
        Create Account
      </motion.button>
    </form>
  );
}

