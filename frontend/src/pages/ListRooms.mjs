import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const navigate = useNavigate();

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
            setRooms(rooms.filter(room => room._id !== roomId));
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

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedRooms = React.useMemo(() => {
        let sortableRooms = [...rooms];
        if (sortConfig.key !== null) {
            sortableRooms.sort((a, b) => {
                if (sortConfig.key === 'date') {
                    return sortConfig.direction === 'ascending'
                        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
                        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
                } else {
                    if (a[sortConfig.key] < b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (a[sortConfig.key] > b[sortConfig.key]) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableRooms;
    }, [rooms, sortConfig]);

    const handleViewRoom = (roomId) => {
        navigate(`/view-room/${roomId}`);
    };

    const handleBack = () => {
        navigate('/admin-dashboard'); // Navigate to /admin-dashboard
    };

    return (
        <div>
            <style>{`
                body {
                    font-family: Arial, sans-serif;
                    background-color: #ffffff;
                    color: #333333;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #007BFF;
                }
                form {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                form div {
                    flex: 1 1 200px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    color: #555555;
                }
                input, select {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    background-color: #007BFF;
                    color: white;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid #ddd;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #007BFF;
                    color: white;
                    font-weight: bold;
                    cursor: pointer;
                }
                .delete-button {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .delete-button:hover {
                    background-color: #c82333;
                }
                .message {
                    text-align: center;
                    margin-top: 20px;
                    color: green;
                }
                .view-button {
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .view-button:hover {
                    background-color: #218838;
                }
            `}</style>
            <div className="container">
            <button onClick={handleBack} className="back-button">
                ⬅ Back
            </button>
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
                            placeholder="HH:MM-HH:MM"
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
                    <div>
                        <button type="button" onClick={handleAddRoom}>
                            Add Room
                        </button>
                    </div>
                </form>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('roomNumber')}>Room Number</th>
                            <th>Building</th>
                            <th>Floor</th>
                            <th>Capacity</th>
                            <th>Subject</th>
                            <th>Exam</th>
                            <th onClick={() => requestSort('date')}>Date</th>
                            <th>Time</th>
                            <th>Allocated To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRooms.map((room) => (
                            <tr key={room._id}>
                                <td>{room.roomNumber}</td>
                                <td>{room.building}</td>
                                <td>{room.floor}</td>
                                <td>{room.capacity}</td>
                                <td>{room.subject}</td>
                                <td>{room.exam}</td>
                                <td>{room.date}</td>
                                <td>{room.time}</td>
                                <td>{room.allocatedTo?.name}</td>
                                <td>
                                    <button className="delete-button" onClick={() => handleDeleteRoom(room._id)}>Delete</button>
                                    <button className="view-button" onClick={() => handleViewRoom(room._id)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};
