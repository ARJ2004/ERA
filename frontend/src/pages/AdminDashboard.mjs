import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct default import
import '../CSS/AdminDashboard.css';

export const AdminDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.user.id;
          const response = await axios.get(`http://localhost:5000/api/users/details/${userId}`);
          setUserDetails(response.data);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            phno: response.data.phno || '',
          });
        } catch (err) {
          console.error(err);
          navigate('/login'); // Redirect to login if an error occurs
        }
      } else {
        navigate('/login');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user.id;
      await axios.put(`http://localhost:5000/api/users/details/${userId}`, formData);
      setEditing(false);
      const response = await axios.get(`http://localhost:5000/api/users/details/${userId}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error saving details:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={() => navigate('/login')}>Logout</button>
      </header>
      <div className="admin-container">
        <aside className="admin-sidebar">
          <button onClick={() => navigate('/admin/list-users')}>List Users</button>
          <button onClick={() => navigate('/admin/list-rooms')}>List Rooms</button>
          <button onClick={() => navigate('/admin/allocate-room')}>Allocate Room</button>
          <button className="toggle-theme-button" onClick={() => document.body.classList.toggle('dark-theme')}>
            Toggle Theme
          </button>
        </aside>
        <main className="admin-main">
          {userDetails && (
            <div className="user-details">
              {editing ? (
                <form>
                  <div>
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <input type="text" name="phno" value={formData.phno} onChange={handleChange} />
                  </div>
                  <button type="button" onClick={handleSave}>Save</button>
                </form>
              ) : (
                <div>
                  <p>Name: {userDetails.name}</p>
                  <p>Email: {userDetails.email}</p>
                  <p>Phone Number: {userDetails.phno}</p>
                  <button onClick={() => setEditing(true)}>Edit</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
