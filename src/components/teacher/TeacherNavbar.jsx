import { Navbar, Nav, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBook, faCog, faSignOutAlt, faCalendar, faCalendarAlt, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import '../../App.css';

const TeacherNavbar = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            fetchDashboardData(token);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const fetchDashboardData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5002/api/auth/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setUser(response.data.teacher);
            console.log(user);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const handleHome = () => {
        navigate('/teacher-homepage');
    };
    const handleClassRoutine = () => {
        navigate('/class-routine-page');
    };

    const handleScheduleClass = () => {
        
        navigate(`/schedule-class/${user.teacher_id}`);
    }

    const handleViewAcademicCalendar = () => {
        navigate('/view-academic-calendar');
    }

    const handlePreferredSlots = () => {
        navigate(`/preferred-slots/${user.teacher_id}`)
    }

    const handleTeacherProfile = () => {
        navigate(`/teacher-profile/${user.teacher_id}`);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="py-3 px-2">
            <Navbar.Brand href="#home" className="font-weight-bold text-uppercase">
                <FontAwesomeIcon icon={faBook} className="mr-2" />
                SCRMS
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link onClick={handleHome} className="text-light">
                        <FontAwesomeIcon icon={faHome} className="mr-1" />
                        Home
                    </Nav.Link>
                    <Nav.Link onClick={handleClassRoutine} className="text-light">
                        <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                        Class Routine
                    </Nav.Link>
                    <Nav.Link onClick={handleViewAcademicCalendar} className="text-light">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        Academic Calendar
                    </Nav.Link>

                    <Nav.Link onClick={handleScheduleClass} className="text-light">
                        <FontAwesomeIcon icon={faCog} className="mr-1" />
                        Schedule Class
                    </Nav.Link>

                    <Nav.Link onClick={handlePreferredSlots} className="text-light">
                        <FontAwesomeIcon icon={faCog} className="mr-1" />
                        Preferred Slots
                    </Nav.Link>

                    <Nav.Link href="#settings" className="text-light">
                        <FontAwesomeIcon icon={faCog} className="mr-1" />
                        Settings
                    </Nav.Link>
                </Nav>
                <Navbar.Text onClick={handleTeacherProfile} className="mr-3 text-light">
                    <FontAwesomeIcon icon={faUser} className="mr-1" />
                    {user ? `${user.Name}` : 'Loading...'}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                    Logout
                </Button>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default TeacherNavbar;
