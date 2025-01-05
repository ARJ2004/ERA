import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ListRooms = () => {
const [rooms, setRooms] = useState([]);
const [formData, setFormData] = useState({
roomNumber: '',
building: '',
floor: '',
capacity: '',
subject: '',
exam: '',
date: '',
time: '',
allocatedTo: '',
});
const [users, setUsers] = useState([]);
const [message, setMessage] = useState('');

useEffect(() => {
const fetchRooms = async () => {
try {
const response = await axios.get('http://localhost:5000/api/users/rooms');
setRooms(response.data);
} catch (err) {
console.error(err);
}
};


const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/all');
    setUsers(response.data);
  } catch (err) {
    console.error(err);
  }
};

fetchRooms();
fetchUsers();
}, []);

const handleAddRoom = async () => {
try {
await axios.post('http://localhost:5000/api/users/rooms', formData);
const response = await axios.get('http://localhost:5000/api/users/rooms');
setRooms(response.data);
setFormData({
roomNumber: '',
building: '',
floor: '',
capacity: '',
subject: '',
exam: '',
date: '',
time: '',
allocatedTo: '',
});
setMessage('Room added successfully');
} catch (err) {
if (err.response && err.response.data && err.response.data.message) {
setMessage(err.response.data.message);
} else {
setMessage('Failed to add room');
}
}
};

const handleDeleteRoom = async (roomId) => {
  try {
    await axios.delete(`http://localhost:5000/api/users/rooms/${roomId}`);
    setRooms(rooms.filter((room) => room._id !== roomId));
    setMessage('Room deleted successfully');
  } catch (err) {
    console.error('Error deleting room:', err);
    setMessage('Failed to delete room');
  }
};


const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

return (
<div>
<h1>List Rooms</h1>
<form>
<div>
<label>Room Number</label>
<input
         type="text"
         name="roomNumber"
         value={formData.roomNumber}
         onChange={handleChange}
       />
</div>
<div>
<label>Building</label>
<input
         type="text"
         name="building"
         value={formData.building}
         onChange={handleChange}
       />
</div>
<div>
<label>Floor</label>
<input
         type="text"
         name="floor"
         value={formData.floor}
         onChange={handleChange}
       />
</div>
<div>
<label>Capacity</label>
<input
         type="text"
         name="capacity"
         value={formData.capacity}
         onChange={handleChange}
       />
</div>
<div>
<label>Subject</label>
<input
         type="text"
         name="subject"
         value={formData.subject}
         onChange={handleChange}
       />
</div>
<div>
<label>Exam</label>
<input
         type="text"
         name="exam"
         value={formData.exam}
         onChange={handleChange}
       />
</div>
<div>
<label>Date</label>
<input
         type="text"
         name="date"
         value={formData.date}
         onChange={handleChange}
         placeholder="DD/MM/YYYY"
       />
</div>
<div>
<label>Time</label>
<input
         type="text"
         name="time"
         value={formData.time}
         onChange={handleChange}
         placeholder="HH\:MM-HH\:MM"
       />
</div>
<div>
<label>Allocated To</label>
<select name="allocatedTo" value={formData.allocatedTo} onChange={handleChange}>
<option value="">Select User</option>
{users.map((user) => (
<option key={user._id} value={user._id}>
{user.name} ({user.role})
</option>
))}
</select>
</div>
<button type="button" onClick={handleAddRoom}>
Add Room
</button>
</form>
<ul>
{rooms.map((room) => (
<li key={room._id}>
{room.roomNumber} - {room.building} - {room.floor} - {room.capacity} -{' '}
{room.subject} - {room.exam} - {room.date} - {room.time} - Allocated to:{' '}
{room.allocatedTo?.name}
<button onClick={() => handleDeleteRoom(room._id)}>Delete</button>
</li>
))}
</ul>
{message && <p>{message}</p>}
</div>
);
};