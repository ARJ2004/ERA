import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/SignUpForm.css'; // Custom CSS for additional styling

export const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        email,
        password,
        name,
        role,
      });

      if (response.data.token) {
        setSuccess(true);
        setError('');
      }
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-2xl text-center transform transition-transform duration-500">
          <h2 className="text-xl font-bold text-green-600 mb-4">Account Created Successfully!</h2>
          <p className="text-gray-700 mb-4">Please check your email to verify your account.</p>
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-xs transform transition-transform duration-500">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-extrabold text-indigo-600">Exam Room Allocation (ERA)</h1>
          <h2 className="text-xl font-bold text-gray-800 mt-2">Sign Up</h2>
        </div>
        {error && (
          <div className="text-red-600 text-sm mb-4 text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="student">Student</option>
              <option value="invigilator">Invigilator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transform transition-transform duration-300 hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};
