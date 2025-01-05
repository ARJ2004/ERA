import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ListUsers = () => {
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
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setMessage('User deleted successfully');
    } catch (err) {
      console.error(err);
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

  return (
    <div>
      <h1>List Users</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {editingUser === user._id ? (
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
                  <label>Role</label>
                  <input type="text" name="role" value={formData.role} onChange={handleChange} />
                </div>
                {user.role === 'student' && (
                  <>
                    <div>
                      <label>USN</label>
                      <input type="text" name="usn" value={formData.usn} onChange={handleChange} />
                    </div>
                    <div>
                      <label>Class</label>
                      <input type="text" name="class" value={formData.class} onChange={handleChange} />
                    </div>
                  </>
                )}
                {user.role === 'invigilator' && (
                  <>
                    <div>
                      <label>EID</label>
                      <input type="text" name="eid" value={formData.eid} onChange={handleChange} />
                    </div>
                    <div>
                      <label>Phone Number</label>
                      <input type="text" name="phno" value={formData.phno} onChange={handleChange} />
                    </div>
                  </>
                )}
                <button type="button" onClick={handleSave}>Save</button>
              </form>
            ) : (
              <div>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {user.role === 'student' && (
                  <>
                    <p>USN: {user.usn}</p>
                    <p>Class: {user.class}</p>
                  </>
                )}
                {user.role === 'invigilator' && (
                  <>
                    <p>EID: {user.eid}</p>
                    <p>Phone Number: {user.phno}</p>
                  </>
                )}
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};
