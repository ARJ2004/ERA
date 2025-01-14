import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ViewRoom = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [students, setStudents] = useState([]);
    const [isDarkTheme, setIsDarkTheme] = useState(true); // Set dark mode as default
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/rooms/${roomId}`);
                setRoom(response.data);
                setStudents(response.data.allocatedSeats || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRoomDetails();
    }, [roomId]);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const tableRows = students.map(student => [student.name, student.usn, student.seatNumber]);
        doc.autoTable({
            head: [['Name', 'USN', 'Seat Number']],
            body: tableRows,
        });
        doc.save(`Room ${room.roomNumber} Students.pdf`);
    };

    const getSeatColor = (seatNumber) => {
        const seat = students.find(student => student.seatNumber === seatNumber);
        return seat ? '#8bc34a' : '#ff5722';
    };

    const getSeatDetails = (seatNumber) => {
        const seat = students.find(student => student.seatNumber === seatNumber);
        return seat ? `${seat.name} (${seat.usn})` : 'Empty';
    };

    const renderSeats = () => {
        const maxColumns = 4;
        const seatsPerColumn = Math.ceil(room.capacity / maxColumns);
        const seats = Array.from({ length: room.capacity }, (_, index) => (
            <div
                key={index}
                style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: getSeatColor(index + 1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #000',
                    margin: '5px',
                    position: 'relative',
                    borderRadius: '5px',
                    boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={() => {
                    const tooltip = document.getElementById(`tooltip-${index + 1}`);
                    if (tooltip) {
                        tooltip.style.visibility = 'visible';
                    }
                }}
                onMouseLeave={() => {
                    const tooltip = document.getElementById(`tooltip-${index + 1}`);
                    if (tooltip) {
                        tooltip.style.visibility = 'hidden';
                    }
                }}
            >
                {index + 1}
                <div
                    id={`tooltip-${index + 1}`}
                    style={{
                        position: 'absolute',
                        top: '-30px',
                        backgroundColor: isDarkTheme ? '#333' : '#fff',
                        border: '1px solid #000',
                        padding: '5px',
                        visibility: 'hidden',
                        whiteSpace: 'nowrap',
                        borderRadius: '3px',
                        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
                        color: isDarkTheme ? '#fff' : '#000',
                    }}
                >
                    {getSeatDetails(index + 1)}
                </div>
            </div>
        ));

        const seatColumns = [];
        for (let i = 0; i < maxColumns; i++) {
            const start = i * seatsPerColumn;
            const end = start + seatsPerColumn;
            seatColumns.push(
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                    {seats.slice(start, end)}
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                {seatColumns}
            </div>
        );
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: isDarkTheme ? '#2c3e50' : '#ecf0f1', minHeight: '100vh', color: isDarkTheme ? '#ecf0f1' : '#2c3e50', transition: 'background-color 0.3s, color 0.3s' }}>
            <h1 style={{ color: '#007bff', textAlign: 'center' }}>View Room: {room.roomNumber}</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ backgroundColor: '#30aa4a', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Back
                </button>
                <button onClick={toggleTheme} style={{ backgroundColor: isDarkTheme ? '#ecf0f1' : '#2c3e50', color: isDarkTheme ? '#2c3e50' : '#ecf0f1', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Toggle Theme
                </button>
            </div>
            <div style={{ backgroundColor: isDarkTheme ? '#34495e' : '#bdc3c7', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <div style={{ width: '80%', height: '30px', backgroundColor: '#3c3c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', marginBottom: '20px' }}>
                        Board
                    </div>
                    {renderSeats()}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button onClick={handleDownloadPDF} style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Download PDF
                </button>
            </div>
        </div>
    );
};
