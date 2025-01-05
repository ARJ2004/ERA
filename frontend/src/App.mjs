import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SignUpForm } from './pages/SignUpForm.mjs';
import { LoginForm } from './pages/LoginForm.mjs';
import { AdminDashboard } from './pages/AdminDashboard.mjs';
import { StudentDashboard } from './pages/StudentDashboard.mjs';
import { InvigilatorDashboard } from './pages/InvigilatorDashboard.mjs';
import { ListUsers } from './pages/ListUsers.mjs';
import { ListRooms } from './pages/ListRooms.mjs';
import { AllocateRoom } from './pages/AllocateRoom.mjs';
import './index.css';
import './App.css'


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/invigilator-dashboard" element={<InvigilatorDashboard />} />
            <Route path="/admin/list-users" element={<ListUsers />} />
            <Route path="/admin/list-rooms" element={<ListRooms />} />
            <Route path="/admin/allocate-room" element={<AllocateRoom />} />
            <Route path="/" element={<SignUpForm />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
