# Exam Room Allocation System

## Introduction

The Exam Room Allocation System is a web-based application designed to automate the process of assigning examination rooms and seats to students. This system leverages the Linear Congruential Generator (LCG) algorithm to ensure fair and efficient seat allocation, minimizing errors and enhancing transparency. The application is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and provides role-specific access for administrators, invigilators, and students.

## Features

- **Automated Seat Allocation**: Uses the LCG algorithm for fair and randomized seat allocation.
- **Role-Based Access**: Secure access for administrators, invigilators, and students.
- **Real-Time Updates**: Provides real-time updates on room and seat assignments.
- **Scalability**: Designed to handle large-scale student data and dynamic scheduling.
- **User-Friendly Interface**: Intuitive web interface built with React.js.

## Tech Stack

- **Frontend**: React.js, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Version Control**: Git
- **Package Manager**: npm

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14 or higher)
- MongoDB
- npm (Node Package Manager)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/exam-room-allocation.git
   cd exam-room-allocation
   Install Dependencies

Navigate to the backend directory and install the dependencies:


cd backend
npm install
Navigate to the frontend directory and install the dependencies:


cd ../frontend
npm install
Environment Variables

Create a .env file in the backend directory and add the following variables:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Running the Application
Start the Backend Server

Navigate to the backend directory and start the server:


cd backend
npm start
The backend server will run on http://localhost:5000.

Start the Frontend Application

Navigate to the frontend directory and start the application:


cd ../frontend
npm start
The frontend application will run on http://localhost:3000.

Testing
To run tests, navigate to the respective directories and use the following commands:

Backend Tests:


cd backend
npm test
Frontend Tests:


cd ../frontend
npm test
Contributing
Contributions are welcome! Please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.
