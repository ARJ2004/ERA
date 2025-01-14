import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../CSS/LoginForm.css'; // Custom CSS for additional styling

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const decodedToken = jwtDecode(response.data.token);
        const userRole = decodedToken.user.role;

        if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else if (userRole === 'student') {
          navigate('/student-dashboard');
        } else if (userRole === 'invigilator') {
          navigate('/invigilator-dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-xs transform transition-transform duration-500">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold text-indigo-600">Exam Room Allocation (ERA)</h1>
          <h2 className="text-xl font-bold text-gray-800 mt-2">Login</h2>
        </div>
        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 flex items-center relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
                aria-required="true"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transform transition-transform duration-300 hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-300"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
