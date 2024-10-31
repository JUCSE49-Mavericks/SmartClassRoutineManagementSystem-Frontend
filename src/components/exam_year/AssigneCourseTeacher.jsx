import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Papa from 'papaparse';
import { Card, Container, ListGroup, Row, Col, Button, Form } from 'react-bootstrap';

function UpdateAssignedCourseTeacher() {
    const { exam_year_id } = useParams();
    const [teachers, setTeachers] = useState([]);
    const [assignedCourses, setAssignedCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDeptId, setSelectedDeptId] = useState(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [showAssignOptions, setShowAssignOptions] = useState({});
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchAllTeacher = async () => {
                try {
                    const teacherResponse = await axios.get('http://localhost:5002/api/all-teachers/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setTeachers(teacherResponse.data);

                    console.log(teacherResponse.data);
                    // Extract unique departments
                    const uniqueDepartments = Array.from(
                        new Set(teacherResponse.data.map((teacher) => teacher.dept_id))
                    ).map((dept_id) => {
                        return {
                            dept_id,
                            dept_name: teacherResponse.data.find((t) => t.dept_id === dept_id).Dept_Name
                        };
                    });
                    setDepartments(uniqueDepartments);
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
                    console.log(assignedCoursesResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                }
            };

            fetchAllTeacher();
            fetchAssignedCourses();
        } else {
            navigate('/login');
        }
    }, [exam_year_id, navigate]);

    const handleAssignClick = (courseId) => {
        setShowAssignOptions((prev) => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));
    };

    const handleDepartmentSelect = (dept_id) => {
        setSelectedDeptId(dept_id);
        setSelectedTeacherId(null); // Reset selected teacher when department changes
    };

    const handleTeacherSelect = (teacher_id) => {
        setSelectedTeacherId(teacher_id);
    };

    const handleUpdate = async (course) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                'http://localhost:5002/api/update-course-teacher',
                {
                    assigned_course_teacher_id: course.assigned_course_teacher_id,
                    teacher_id: selectedTeacherId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // After successful update, hide the assignment options and update the displayed teacher
            setShowAssignOptions((prev) => ({ ...prev, [course.course_id]: false }));
            setAssignedCourses((prevCourses) =>
                prevCourses.map((c) =>
                    c.course_id === course.course_id
                        ? { ...c, teacher_id: selectedTeacherId }
                        : c
                )
            );
            setSelectedDeptId(null);
            setSelectedTeacherId(null);
        } catch (error) {
            console.error('Error updating course teacher:', error);
        }
    };


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvData = event.target.result;
            try {
                // Parse the CSV data
                const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
                const jsonData = parsedData.data; // This will be an array of objects
    
                const response = await axios.post('http://localhost:5002/api/upload-csv-assigned-course-teacher', {
                    csvData: jsonData, // Sending parsed data as JSON
                });
    
                alert(response.data.message);
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Error uploading file. Please try again.');
            }
        };
        reader.readAsText(file);
    };
    
    return (
        <Container className="my-5">
            <Card className="shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h2>Upload CSV File</h2>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select CSV file</Form.Label>
                            <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
                        </Form.Group>
                        <Button variant="success" onClick={handleUpload} disabled={!file}>
                            Upload
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <Card className="shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h2>Assign Course Teacher</h2>
                </Card.Header>
                <Card.Body>
                    <ListGroup>
                        {assignedCourses.map((course) => (
                            <ListGroup.Item key={course.course_id}>
                                <Row>
                                    <Col md={3}>
                                        <strong>{course.Course_title}</strong>
                                    </Col>
                                    <Col md={3}>
                                        <strong>{course.Course_code}</strong>
                                    </Col>
                                    <Col md={3}>
                                        {course.teacher_id
                                            ? teachers.find((t) => t.teacher_id === course.teacher_id)?.Name
                                            : "Unassigned"}
                                    </Col>
                                    <Col md={3}>
                                        <Button variant="outline-primary" onClick={() => handleAssignClick(course.course_id)}>
                                            Assign
                                        </Button>
                                    </Col>
                                </Row>

                                {showAssignOptions[course.course_id] && (
                                    <Row className="mt-3">
                                        <Col md={5}>
                                            <Form.Group controlId="formDepartment">
                                                <Form.Label>Select Department</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    onChange={(e) => handleDepartmentSelect(Number(e.target.value))}
                                                    value={selectedDeptId || ""}
                                                >
                                                    <option value="">Choose...</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept.dept_id} value={dept.dept_id}>
                                                            {dept.dept_name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>

                                        <Col md={5}>
                                            <Form.Group controlId="formTeacher">
                                                <Form.Label>Select Teacher</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    onChange={(e) => handleTeacherSelect(Number(e.target.value))}
                                                    value={selectedTeacherId || ""}
                                                    disabled={!selectedDeptId}
                                                >
                                                    <option value="">Choose...</option>
                                                    {teachers
                                                        .filter((teacher) => teacher.dept_id === selectedDeptId)
                                                        .map((teacher) => (
                                                            <option key={teacher.teacher_id} value={teacher.teacher_id}>
                                                                {teacher.Name}
                                                            </option>
                                                        ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>

                                        <Col md={2} className="d-flex align-items-end">
                                            <Button
                                                variant="success"
                                                onClick={() => handleUpdate(course)}
                                                disabled={!selectedTeacherId}
                                            >
                                                Update
                                            </Button>
                                        </Col>
                                    </Row>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default UpdateAssignedCourseTeacher;
