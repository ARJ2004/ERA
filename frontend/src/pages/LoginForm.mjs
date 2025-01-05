import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons

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
    <div className="min-h-screen bg-blue-500 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <p className="text-center text-sm text-gray-600">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
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

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
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
  );
};
