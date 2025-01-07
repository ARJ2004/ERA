import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const ViewRoom = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [students, setStudents] = useState([]);

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
        return seat ? 'lightgreen' : 'lightcoral';
    };

    const getSeatDetails = (seatNumber) => {
        const seat = students.find(student => student.seatNumber === seatNumber);
        return seat ? `${seat.name} (${seat.usn})` : 'Empty';
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>View Room: {room.roomNumber}</h1>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                {Array.from({ length: room.capacity }, (_, index) => (
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
                            position: 'relative',
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
                                backgroundColor: '#fff',
                                border: '1px solid #000',
                                padding: '5px',
                                visibility: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {getSeatDetails(index + 1)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
