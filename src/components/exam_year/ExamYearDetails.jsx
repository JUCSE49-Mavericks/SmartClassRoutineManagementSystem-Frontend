import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, ListGroup, Row, Col, Button, Form } from 'react-bootstrap';

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
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState({});
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

                    const coursesData = coursesResponse.data;
                    console.log('course data:', coursesResponse.data);

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
                    const classRepData = crResponse.data[0];
                    setClassRepresentative(classRepData);

                    if (classRepData?.student_id) {
                        const studentProfileResponse = await axios.get(`http://localhost:5002/api/student-profile/${classRepData.student_id}`, {
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

            const fetchAllTeachers = async () => {
                try {
                    const teacherResponse = await axios.get('http://localhost:5002/api/all-teachers/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTeachers(teacherResponse.data);
                    console.log(teacherResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            const fetchAssignedCourseTeacher = async () => {
                try {
                    const assignedCourseTeacherResponse = await axios.get(`http://localhost:5002/api/assigned-course-teachers/${exam_year_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAssignedCourseTeacher(assignedCourseTeacherResponse.data);
                    console.log(assignedCourseTeacher);
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
            fetchAllTeachers();
            fetchAssignedCourseTeacher();
        } else {
            navigate('/login');
        }
    }, [exam_year_id, navigate]);

    const handleDepartmentChange = (e) => {
        setSelectedDepartment(e.target.value);
        setSelectedTeacher({});
    };

    const uniqueDepartments = [...new Set(teachers.map((teacher) => teacher.dept_id))];

    const filteredTeachers = teachers.filter(teacher => teacher.dept_id === selectedDepartment);

    const handleTeacherChange = (courseId, teacherId) => {
        setSelectedTeacher(prevState => ({ ...prevState, [courseId]: teacherId }));
    };

    const handleUpdateCourseTeacher = async (courseId) => {
        const teacherId = selectedTeacher[courseId];
        if (!teacherId) {
            alert("Please select a teacher.");
            return;
        }

        try {
            await axios.post('http://localhost:5002/api/update-course-teacher', {
                course_id: courseId,
                teacher_id: teacherId
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert("Teacher assigned successfully!");
        } catch (error) {
            console.error('Error assigning course teacher:', error);
            alert("Failed to assign teacher. Please try again.");
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

    if (!examYearDetails || !teachers) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Exam Year Details</h2>

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

            <Card className="mb-4 shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>Courses</h4>
                </Card.Header>
                <Card.Body>
                    <ListGroup className="mt-3">
                        {courses.length > 0 ? (
                            courses.map((course) => {
                                const teacher = teachers.find((t) => t.teacher_id === course.teacher_id);
                                const teacherName = teacher ? teacher.Name : 'Not assigned';
                                return (
                                    <ListGroup.Item key={course.course_id}>
                                        <Row>
                                            <Col>{course.Course_title}</Col>
                                            <Col>{course.Course_code}</Col>
                                            <Col>{teacherName}</Col>
                                            <Col>
                                                <Form.Select
                                                    aria-label="Select Department"
                                                    value={selectedDepartment}
                                                    onChange={handleDepartmentChange}
                                                    className="mb-2"
                                                >
                                                    <option value="">Select Department</option>
                                                    {uniqueDepartments.map((department, index) => (
                                                        <option key={index} value={department}>
                                                            {department}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {selectedDepartment && (
                                                    <Form.Select
                                                        aria-label="Select Teacher"
                                                        onChange={(e) => handleTeacherChange(course.course_id, e.target.value)}
                                                        value={selectedTeacher[course.course_id] || ""}
                                                    >
                                                        <option value="">Select Teacher</option>
                                                        {filteredTeachers.map((teacher) => (
                                                            <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                                                {teacher.Name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                )}
                                            </Col>
                                            <Col>
                                                <Button variant="primary" onClick={() => handleUpdateCourseTeacher(course.course_id)}>
                                                    Assign
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                );
                            })
                        ) : (
                            <p>No courses found.</p>
                        )}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ExamYearDetails;
