# Exam Room Allocation System

## Introduction
Efficient and accurate exam room allocation is crucial for educational institutions. Traditional manual methods often lead to mismanagement and errors. This project automates the exam room and seat allocation process using the **Linear Congruential Generator (LCG) algorithm** to ensure fairness and transparency. Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js), this system optimizes resource utilization and improves the examination experience.

## Features
- **Automated, randomized seat allocation** using the LCG algorithm.
- **Role-based access** for administrators, invigilators, and students.
- **Real-time updates** on room allocation and scheduling.
- **Efficient room utilization** to prevent over/under-allocation.
- **Scalable system** suitable for institutions of varying sizes.

## Tech Stack
- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js)
- Git

## Installation
Follow these steps to set up and run the project locally:

### 1. Clone the Repository
```sh
git clone https://github.com/ARJ2004/ERA.git
cd ERA
```

### 2. Install Backend Dependencies
```sh
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory with the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Start the Backend Server
```sh
npm start
```

### 5. Install Frontend Dependencies
Open a new terminal and run:
```sh
cd frontend
npm install
```

### 6. Start the Frontend Application
```sh
npm start
```
This will start the application at `http://localhost:3000`.

## Usage
1. **Admin Login:** Manage users, rooms, and allocate seats.
2. **Invigilators:** View assigned rooms and students.
3. **Students:** Check allocated exam room and seat.

## Future Enhancements
- **AI-based seat optimization** for improved allocation.
- **Mobile application support** for easy access.
- **Integration with LMS** for automated exam scheduling.
- **Multilingual support** for a wider audience.

## Contributing
Contributions are welcome! Fork the repository and submit a pull request with your improvements.



