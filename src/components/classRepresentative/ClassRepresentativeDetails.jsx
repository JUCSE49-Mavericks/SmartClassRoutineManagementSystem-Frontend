import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Row, Col, Badge } from 'react-bootstrap';
import '../../App.css';

const ClassRepresentativeDetails = () => {
    const { exam_year_id } = useParams();
    const [crDetails, setCrDetails] = useState(null);
    const [examYearDetails, setExamYearDetails] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchClassRepresentativeDetails = async () => {
                try {
                    const crResponse = await axios.get(`http://localhost:5002/api/class-representative/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const crData = crResponse.data[0];
                    setCrDetails(crData);

                    const examYearResponse = await axios.get(`http://localhost:5002/api/exam-year-details/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setExamYearDetails(examYearResponse.data);

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
    }, [exam_year_id, navigate]);

    if (!crDetails || !studentProfile || !examYearDetails) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">

            {/* Display Class Representative Profile */}
            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Class Representative Information</h4>
                </Card.Header>
                <Card.Body>
                    {/* Exam Year Details Section */}
                    <div className="mb-4 text-center">
                        <Badge bg="info" className="me-2 p-2">
                            <strong>{examYearDetails.Year}</strong> Year
                        </Badge>
                        <Badge bg="success" className="me-2 p-2">
                            <strong>{examYearDetails.Semester}</strong> Semester
                        </Badge>
                        <Badge bg="secondary" className="me-2 p-2">
                            Exam Year: <strong>{examYearDetails.Exam_year}</strong>
                        </Badge>
                        <Badge bg="dark" className="p-2">
                            <strong>{examYearDetails.Education_level}</strong>
                        </Badge>
                    </div>

                    {/* Student and Class Representative Details */}
                    <Row className="mb-3">
                        <Col><strong>Name:</strong> {studentProfile.student.Name}</Col>
                        <Col><strong>Role:</strong> {crDetails.role}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Class Roll:</strong> {studentProfile.student.Class_roll}</Col>
                        <Col><strong>Exam Roll:</strong> {studentProfile.student.Exam_roll}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Registration No:</strong> {studentProfile.student.Registration_no}</Col>
                        <Col><strong>Email:</strong> {studentProfile.student.Email}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col><strong>Phone:</strong> {studentProfile.student.Phone}</Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ClassRepresentativeDetails;
