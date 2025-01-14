import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../CSS/ListUsers.css'; // Import the CSS file for styling

export const ListUsers = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        usn: '',
        class: '',
        eid: '',
        phno: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/all');
                setUsers(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user._id);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            usn: user.usn || '',
            class: user.class || '',
            eid: user.eid || '',
            phno: user.phno || '',
        });
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/api/users/details/${editingUser}`, formData);
            const response = await axios.get('http://localhost:5000/api/users/all');
            setUsers(response.data);
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                role: '',
                usn: '',
                class: '',
                eid: '',
                phno: '',
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (userId) => {
        try {
            console.log(`Deleting user with ID: ${userId}`); // Debugging log
            const response = await axios.delete(`http://localhost:5000/api/users/users/${userId}`); // Updated URL
            console.log('Delete response:', response.data); // Debugging log
            setUsers(users.filter(user => user._id !== userId));
            setMessage('User deleted successfully');
        } catch (err) {
            console.error(`Error deleting user: ${err.message}`); // Detailed error log
            setMessage('Failed to delete user');
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?name=${searchTerm}`);
            setUsers(response.data);
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFileChange = (e) => {
        setCsvFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!csvFile) {
            setMessage('Please select a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            await axios.post('http://localhost:5000/api/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const response = await axios.get('http://localhost:5000/api/users/all');
            setUsers(response.data);
            setMessage('Users uploaded successfully');
        } catch (err) {
            console.error(err);
            setMessage('Failed to upload users');
        }
    };

    const handleBack = () => {
        navigate('/admin-dashboard'); // Navigate to /admin-dashboard
    };

    return (
        <div className="container">
            <button onClick={handleBack} className="back-button">
                ⬅ Back
            </button>
            <h1>List Users</h1>
            <div className="search-upload">
                <div className="search-area">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button onClick={handleSearch} className="search-button">Search</button>
                </div>
                <div className="upload-area">
                    <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" />
                    <button onClick={handleUpload} className="upload-button">Upload CSV</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>USN/EID</th>
                        <th>Class</th>
                        <th>Phone Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            {editingUser === user._id ? (
                                <>
                                    <td><input type="text" name="name" value={formData.name} onChange={handleChange} /></td>
                                    <td><input type="email" name="email" value={formData.email} onChange={handleChange} /></td>
                                    <td><input type="text" name="role" value={formData.role} onChange={handleChange} /></td>
                                    <td>
                                        {user.role === 'student' ? (
                                            <input type="text" name="usn" value={formData.usn} onChange={handleChange} />
                                        ) : (
                                            <input type="text" name="eid" value={formData.eid} onChange={handleChange} />
                                        )}
                                    </td>
                                    <td>
                                        {user.role === 'student' && (
                                            <input type="text" name="class" value={formData.class} onChange={handleChange} />
                                        )}
                                    </td>
                                    <td>
                                        {user.role === 'invigilator' && (
                                            <input type="text" name="phno" value={formData.phno} onChange={handleChange} />
                                        )}
                                    </td>
                                    <td><button type="button" onClick={handleSave} className="action-button save-button">Save</button></td>
                                </>
                            ) : (
                                <>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.role === 'student' ? user.usn : user.eid}</td>
                                    <td>{user.role === 'student' ? user.class : ''}</td>
                                    <td>{user.role === 'invigilator' ? user.phno : ''}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user)} className="action-button edit-button">Edit</button>
                                        <button onClick={() => handleDelete(user._id)} className="action-button delete-button">Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {message && <p>{message}</p>}
        </div>
    );
};
