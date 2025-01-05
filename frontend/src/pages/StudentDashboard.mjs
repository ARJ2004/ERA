import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const StudentDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [allocatedRoom, setAllocatedRoom] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
    class: '',
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
            usn: response.data.usn || '',
            class: response.data.class || '',
          });
          setAllocatedRoom(response.data.allocatedRoom);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
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
                  <label>USN</label>
                  <input type="text" name="usn" value={formData.usn} onChange={handleChange} />
                </div>
                <div>
                  <label>Class</label>
                  <input type="text" name="class" value={formData.class} onChange={handleChange} />
                </div>
                <button type="button" onClick={handleSave}>Save</button>
              </form>
            ) : (
              <div>
                <p>Name: {userDetails.name}</p>
                <p>Email: {userDetails.email}</p>
                <p>USN: {userDetails.usn}</p>
                <p>Class: {userDetails.class}</p>
                <button onClick={handleEdit}>Edit</button>
              </div>
            )}
          </div>
        )}
      </div>
      <h2>Allocated Room</h2>
      {allocatedRoom ? (
        <div>
          <p>Room Number: {allocatedRoom.roomNumber}</p>
          <p>Building: {allocatedRoom.building}</p>
          <p>Floor: {allocatedRoom.floor}</p>
          <p>Capacity: {allocatedRoom.capacity}</p>
          <p>Subject: {allocatedRoom.subject}</p>
          <p>Exam: {allocatedRoom.exam}</p>
          <p>Seat Number: {userDetails.seatNumber}</p>
        </div>
      ) : (
        <p>No Room is allocated</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
