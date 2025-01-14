import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/HomePage.css';

const HomePage = () => {
    const footerRef = useRef(null);

    const scrollToFooter = () => {
        footerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="homepage">
            <header>
                <div className="logo">ERA</div>
                <nav>
                    <ul>
                        <li><Link to="/" className="nav-btn">Home</Link></li>
                        <li><Link to="/features" className="nav-btn">Features</Link></li>
                        <li><button className="nav-btn" onClick={scrollToFooter}>Contact</button></li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    <Link to="/login" className="auth-btn">Login</Link>
                    <Link to="/signup" className="auth-btn">Sign Up</Link>
                </div>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Streamline Exam Hall Allocation</h1>
                    <p>Simplifying the process of exam room assignment for students and institutions.</p>
                    <input type="email" placeholder="Enter your e-mail address" />
                    <button className="contact-btn" onClick={scrollToFooter}>Contact Us</button>
                </div>
                <div className="hero-image">
                    <img src={`${process.env.PUBLIC_URL}/Studentwithbooks.jpeg`} alt="Student with books" />
                </div>
            </section>

            <section className="features">
                <div className="feature">
                    <img src={`${process.env.PUBLIC_URL}/Examhall.jpeg`} alt="Exam Hall" />
                    <h2>Streamlined Exam Hall Allotment</h2>
                    <p>Our Exam Room Allocation system revolutionizes the way colleges conduct examinations by automating the hall allotment process. With this web-based application, institutes can effortlessly assign exam rooms to students based on their respective classes and branches. The software reduces the time spent on manual arrangements, allowing administration to focus on other important aspects of managing exams while ensuring that each student has a designated place during assessments.</p>
                    <button className="learn-more-btn">Learn More</button>
                </div>
                <div className="feature">
                    <h2>Real-Time Access to Student Information</h2>
                    <p>The platform provides real-time access to critical examination information for both students and staff. Students can easily check their assigned halls, seat numbers, and relevant details at any time before the exam day. This function not only minimizes confusion but also enhances communication between students and administrative personnel regarding seating arrangements thereby improving overall efficiency in handling examination logistics.</p>
                    <img src={`${process.env.PUBLIC_URL}/Studentimg.jpeg`} alt="Students discussing" />
                </div>
            </section>

            <footer ref={footerRef}>
                <p>&copy; 2025 AJ. All rights reserved.</p>
                <p>ADARSH R-1GA22CS009</p>
                <p>CHANDAN K-1GA22CS037</p>
            </footer>
        </div>
    );
};

export default HomePage;
