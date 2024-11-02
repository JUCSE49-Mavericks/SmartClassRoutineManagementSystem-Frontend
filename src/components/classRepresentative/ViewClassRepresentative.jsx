import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';

import '../../App.css';

const ViewClassRepresentative = () => {
    const { cr_id } = useParams();
    const [examYearDetails, setExamYearDetails] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchClassRepresentativeDetails = async () => {
                try {
                    // Fetch class representative details using cr_id
                    const crResponse = await axios.get(`http://localhost:5002/api/class-representative/${cr_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    const crData = crResponse.data;
                    
                    // Set exam year details and fetch student profile if student_id exists
                    // setExamYearDetails(crData.examYear);
                    
                    if (crData.student_id) {
                        const studentProfileResponse = await axios.get(`http://localhost:5002/api/student-profile/${crData.student_id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setStudentProfile(studentProfileResponse.data);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            fetchClassRepresentativeDetails();
        } else {
            navigate('/login');
        }
    }, [cr_id, navigate]);

    if (!examYearDetails || !studentProfile) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Class Representative Details</h2>

            {/* Display Exam Year Details */}
            {/* <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Exam Year: {examYearDetails.Exam_year || 'N/A'}</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>{examYearDetails.Education_level}</Col>
                        <Col>{examYearDetails.Year} year {examYearDetails.Semester} Semester</Col>
                        <Col>{examYearDetails.Exam_year}</Col>
                    </Row>
                </Card.Body>
            </Card> */}

            {/* Display Student Profile */}
            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Class Representative</h4>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>{studentProfile.student.Name}</Col>
                        <Col>{studentProfile.department.Dept_Name}</Col>
                        <Col>{examYearDetails.role}</Col>
                        <Col>
                            <Link to={`/class-representative-profile/${cr_id}`}>
                                View Full Profile
                            </Link>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ViewClassRepresentative;
