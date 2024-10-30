import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup, Row, Col, Button } from 'react-bootstrap';

import '../../App.css';

const ExamYearDetails = () => {
    const { exam_year_id } = useParams();
    const [examCommittee, setExamCommittee] = useState([]);
    const [examYearDetails, setExamYearDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [classRepresentative, setClassRepresentative] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null); // New state for student profile
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchExamDetails = async () => {
                try {
                    const examYearResponse = await axios.get(`http://localhost:5002/api/exam-year-details/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setExamYearDetails(examYearResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            const fetchExamCommittee = async () => {
                try {
                    const examCommitteeResponse = await axios.get(`http://localhost:5002/api/exam-committee-exam-year/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setExamCommittee(Array.isArray(examCommitteeResponse.data) ? examCommitteeResponse.data : [examCommitteeResponse.data]);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            const fetchCourses = async () => {
                try {
                    const coursesResponse = await axios.get(`http://localhost:5002/api/courses-exam-year/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCourses(coursesResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            const fetchClassRepresentative = async () => {
                try {
                    const crResponse = await axios.get(`http://localhost:5002/api/class-representative/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // Assuming crResponse.data is an array and you want the first item
                    const classRepData = crResponse.data[0];
                    setClassRepresentative(classRepData);

                    console.log(classRepData.student_id);

                    // Fetch student profile if student_id is present
                    if (classRepData?.student_id) {
                        const studentProfileResponse = await axios.get(`http://localhost:5002/api/student-profile/${classRepData.student_id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setStudentProfile(studentProfileResponse.data);
                        console.log(studentProfileResponse.data);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };


            fetchExamDetails();
            fetchExamCommittee();
            fetchCourses();
            fetchClassRepresentative();
        } else {
            navigate('/login');
        }
    }, [exam_year_id, navigate]);

    const handleDeleteCommitteeMember = async (exam_committee_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/delete-exam-committee-member/${exam_committee_id}`);
            setExamCommittee(examCommittee.filter(member => member.exam_committee_id !== exam_committee_id));
        } catch (error) {
            console.error('Failed to delete committee member:', error);
        }
    };

    if (!examYearDetails) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Exam Year Details</h2>

            {/* Display Exam Year Details */}
            <Card className="mb-4 shadow-lg">
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
            </Card>

            {/* Display Class Representative Details */}
            {classRepresentative && studentProfile && (
                <Card className="mb-4 shadow-lg">
                    <Card.Header className="bg-primary text-white text-center">
                        <h4>Class Representative</h4>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>{studentProfile.student.Name}</Col>
                            <Col>{studentProfile.department.Dept_Name}</Col>
                            <Col>{classRepresentative.role}</Col>
                            <Col>
                                <Link to={`/class-representative-details/${exam_year_id}`}>
                                    View Profile
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {/* Display Exam Committee Members */}
            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Exam Committee Members</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup className="mt-3">
                        {examCommittee.length > 0 ? (
                            examCommittee.map((committeeMember) => (
                                <ListGroup.Item key={committeeMember.exam_committee_id}>
                                    <Row>
                                        <Col>{committeeMember.Name || 'No Name'}</Col>
                                        <Col>{committeeMember.Designation || 'No Designation'}</Col>
                                        <Col>
                                            <Button variant="danger" onClick={() => handleDeleteCommitteeMember(committeeMember.exam_committee_id)}>
                                                Delete
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No committee members found.</p>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>

            {/* Display List of Courses */}
            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Courses</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup className="mt-3">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <ListGroup.Item key={course.course_id}>
                                    <Row>
                                        <Col>
                                            <Link to={`/course-details/${course.course_id}`}>
                                                {course.Course_code}
                                            </Link>
                                        </Col>
                                        <Col>{course.Course_title}</Col>
                                        <Col>{course.Course_type}</Col>
                                        <Col>{course.Course_credit} Credits</Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No courses found for this exam year.</p>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExamYearDetails;
