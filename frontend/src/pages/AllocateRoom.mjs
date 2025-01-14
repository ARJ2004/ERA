import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../CSS/AllocateRoom.css'; // Import the CSS file for styling

// Linear Congruential Generator (LCG) function
const lcg = (seed) => {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    return (a * seed + c) % m;
};

export const AllocateRoom = () => {
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [message, setMessage] = useState('');
    const [searchUSN, setSearchUSN] = useState('');
    const [searchClass, setSearchClass] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [roomCapacity, setRoomCapacity] = useState(0);
    const [roomOccupancy, setRoomOccupancy] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/all');
                const studentList = response.data.filter(user => user.role === 'student');
                setStudents(studentList);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/rooms');
                setRooms(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStudents();
        fetchRooms();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search/usn?usn=${searchUSN}`);
            setStudents(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClassSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search/class?class=${searchClass}`);
            setStudents(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRoomSelect = async (roomId) => {
        setSelectedRoom(roomId);
        try {
            const room = rooms.find(room => room._id === roomId);
            if (room) {
                setRoomCapacity(room.capacity);
                const response = await axios.get(`http://localhost:5000/api/users/rooms/${roomId}/occupancy`);
                setRoomOccupancy(response.data.occupancy);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAllocate = async () => {
        if (selectedStudents.length === 0 || !selectedRoom) {
            setMessage('Please select students and a room');
            return;
        }
        try {
            const room = rooms.find(room => room._id === selectedRoom);
            if (room) {
                if (roomOccupancy + selectedStudents.length > roomCapacity) {
                    setMessage('Room capacity exceeded');
                    return;
                }
                const seed = Date.now(); // Use current timestamp as seed
                const availableSeats = Array.from({ length: roomCapacity - roomOccupancy }, (_, i) => i + 1 + roomOccupancy);
                const seatNumbers = selectedStudents.map(() => {
                    const randomIndex = lcg(seed) % availableSeats.length;
                    const seatNumber = availableSeats.splice(randomIndex, 1)[0];
                    return seatNumber;
                });
                await Promise.all(
                    selectedStudents.map((studentId, index) => {
                        const seatNumber = seatNumbers[index];
                        return axios.put(`http://localhost:5000/api/users/rooms/${selectedRoom}`, { allocatedTo: studentId, seatNumber });
                    })
                );
                await Promise.all(
                    selectedStudents.map((studentId, index) => {
                        const seatNumber = seatNumbers[index];
                        return axios.put(`http://localhost:5000/api/users/details/${studentId}`, { allocatedRoom: selectedRoom, seatNumber });
                    })
                );
                setMessage('Room and seats allocated successfully');
            }
        } catch (err) {
            console.error(err);
            setMessage('Failed to allocate room and seats');
        }
    };

    const handleStudentSelect = (studentId) => {
        if (selectAll) {
            setSelectAll(false);
        }
        setSelectedStudents(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setSelectedStudents(selectAll ? [] : students.map(student => student._id));
    };

    const handleBack = () => {
        navigate('/admin-dashboard'); // Navigate back to the admin dashboard
    };

    return (
        <div className="allocate-room-container">
            <div className="header">
                <h1>Allocate Room</h1>
            </div>
            <div className="search-container">
                <div>
                    <label>Search by USN</label>
                    <input type="text" value={searchUSN} onChange={(e) => setSearchUSN(e.target.value)} />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div>
                    <label>Search by Class</label>
                    <input type="text" value={searchClass} onChange={(e) => setSearchClass(e.target.value)} />
                    <button onClick={handleClassSearch}>Search</button>
                </div>
            </div>
            <div className="select-all-container">
                <label>
                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    Select All
                </label>
            </div>
            <div className="students-table-container">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">
                                <button className="back-button" onClick={handleBack}> ⬅ Back</button>
                            </th>
                        </tr>
                        <tr>
                            <th>Select</th>
                            <th>Name</th>
                            <th>USN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectAll || selectedStudents.includes(student._id)}
                                        onChange={() => handleStudentSelect(student._id)}
                                    />
                                </td>
                                <td>{student.name}</td>
                                <td>{student.usn}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="room-select-container">
                <label>Select Room</label>
                <select value={selectedRoom} onChange={(e) => handleRoomSelect(e.target.value)}>
                    <option value="">Select a room</option>
                    {rooms.map(room => (
                        <option key={room._id} value={room._id}>
                            {room.roomNumber} - {room.subject} - {room.exam}
                        </option>
                    ))}
                </select>
            </div>
            {selectedRoom && (
                <div className="room-details-container">
                    <p>Room Capacity: {roomCapacity}</p>
                    <p>Current Occupancy: {roomOccupancy}</p>
                    <p>Available Seats: {roomCapacity - roomOccupancy}</p>
                </div>
            )}
            <button className="allocate-button" onClick={handleAllocate}>Allocate</button>
            {message && <p className="message">{message}</p>}
        </div>
    );
};
