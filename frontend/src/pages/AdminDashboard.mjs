import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user.id;
        try {
          const response = await axios.get(`http://localhost:5000/api/users/details/${userId}`);
          setUserDetails(response.data);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            phno: response.data.phno || '',
          });
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

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
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleListUsers = () => {
    navigate('/admin/list-users');
  };

  const handleListRooms = () => {
    navigate('/admin/list-rooms');
  };

  const handleAllocateRoom = () => {
    navigate('/admin/allocate-room');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="user-details">
        {userDetails && (
          <div>
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
                <button onClick={handleEdit}>Edit</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="admin-actions">
        <button onClick={handleListUsers}>List Users</button>
        <button onClick={handleListRooms}>List Rooms</button>
        <button onClick={handleAllocateRoom}>Allocate Room</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
