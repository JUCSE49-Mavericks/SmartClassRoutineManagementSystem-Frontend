import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';

import '../../App.css';

const ExamYearDetails = () => {
    const { exam_year_id } = useParams();
    const [examCommittee, setExamCommittee] = useState([]);
    const [examYearDetails, setExamYearDetails] = useState(null);
    const [courses, setCourses] = useState([]);
    const [classRepresentative, setClassRepresentative] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [assignedCourseTeacher, setAssignedCourseTeacher] = useState([]);
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [departmentTeachers, setDepartmentTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showUpdateDropdown, setShowUpdateDropdown] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

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

                    const coursesData = coursesResponse.data;
                    // console.log('course data:', coursesResponse.data);

                    coursesData.forEach(async (course) => {
                        console.log('Sending course_id:', course.course_id, 'and teacher_id: null');
                        try {
                            await axios.post('http://localhost:5002/api/assign-course', {
                                course_id: course.course_id,
                                exam_year_id: exam_year_id
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                        } catch (error) {
                            console.error('Error assigning course teacher:', error);
                        }
                    });


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

                    // Fetch student profile if student_id is present
                    if (classRepData?.student_id) {
                        const studentProfileResponse = await axios.get(`http://localhost:5002/api/student-profile/${classRepData.student_id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setStudentProfile(studentProfileResponse.data);
                        // console.log(studentProfileResponse.data);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };


            const fetchAllTeacher = async () => {
                try {
                    const teacherResponse = await axios.get('http://localhost:5002/api/all-teachers/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTeachers(teacherResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };


            const fetchAssignedCourses = async () => {
                try {
                    const assignedCoursesResponse = await axios.get(`http://localhost:5002/api/get-courses-by-exam-year/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAssignedCourses(assignedCoursesResponse.data);
                    // console.log('holla',assignedCoursesResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            const fetchDepartmentTeachers = async () => {
                try {
                    const departmentTeacherResponse = await axios.get(`http://localhost:5002/api/teacher-by-exam-year/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAssignedCourses(departmentTeacherResponse.data);
                    console.log('ashche', departmentTeacherResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };


            fetchAssignedCourses();
            fetchExamDetails();
            fetchExamCommittee();
            fetchCourses();
            fetchClassRepresentative();
            fetchAllTeacher();

            fetchDepartmentTeachers();
        } else {
            navigate('/login');
        }
    }, [exam_year_id, navigate]);

    useEffect(() => {
        console.log('Assigned Course Teacher: ', assignedCourseTeacher);
    }, [assignedCourseTeacher]);

    useEffect(() => {
        console.log('Teacher List: ', teachers);
    }, [teachers]);

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

    const handleUpdateCommitteeMember = async () => {
        if (selectedTeacher) {
            try {
                await axios.post('http://localhost:5002/api/update-exam-committee', {
                    exam_year_id,
                    teacher_id: selectedTeacher
                });
                setShowUpdateDropdown(false);
                setSelectedTeacher(null);
                fetchExamCommittee();
            } catch (error) {
                console.error('Failed to update committee member:', error);
            }
        }
    };

    const handleDeleteCommitteeMember = async (exam_committee_id) => {
        try {
            await axios.delete(`http://localhost:5002/api/delete-exam-committee-member/${exam_committee_id}`);
            setExamCommittee(examCommittee.filter(member => member.exam_committee_id !== exam_committee_id));
        } catch (error) {
            console.error('Failed to delete committee member:', error);
        }
    };

    // Function to navigate to the AssignCourseTeacherPage
    const handleAssignCourseTeachersClick = () => {
        navigate(`/assign-course-teachers/${exam_year_id}`);
    };

    if (!examYearDetails || !teachers) {
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
            {/* <Card className="mb-4 shadow-lg">
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
            </Card> */}

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
                    <div className="mt-3 text-center">
                        <Button variant="primary" onClick={() => setShowUpdateDropdown(!showUpdateDropdown)}>
                            Update Exam Committee
                        </Button>
                        {showUpdateDropdown && (
                            <DropdownButton
                                className="mt-3"
                                title="Select a teacher"
                                onSelect={(teacher_id) => setSelectedTeacher(teacher_id)}
                            >
                                {departmentTeachers.map((teacher) => (
                                    <Dropdown.Item key={teacher.teacher_id} eventKey={teacher.teacher_id}>
                                        {teacher.Name}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>
                        )}
                        {selectedTeacher && (
                            <Button variant="success" className="mt-3" onClick={handleUpdateCommitteeMember}>
                                Confirm Update
                            </Button>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* Button to Assign Course Teachers */}
            <div className="text-center mb-4">
                <Button variant="primary" onClick={handleAssignCourseTeachersClick}>
                    Assign Course Teachers
                </Button>
            </div>

            {/* Display List of Courses */}
            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Courses</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup className="mt-3">
                        {assignedCourses.length > 0 ? (
                            assignedCourses.map((course) => {
                                // Find the teacher's name if teacher_id is present
                                const teacher = teachers.find((t) => t.teacher_id === course.teacher_id);
                                const teacherName = teacher ? teacher.Name : 'Unassigned';

                                return (
                                    <ListGroup.Item key={course.course_id}>
                                        <Row>
                                            <Col>
                                                <Link to={`/course-details/${course.course_id}`}>
                                                    {course.Course_code}
                                                </Link>
                                            </Col>
                                            <Col>{course.Course_title}</Col>
                                            <Col>{course.Course_type}</Col>
                                            <Col>{course.Couorse_credit} Credits</Col>
                                            <Col>{teacherName}</Col> {/* Display teacher name or "Unassigned" */}
                                        </Row>
                                    </ListGroup.Item>
                                );
                            })
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
