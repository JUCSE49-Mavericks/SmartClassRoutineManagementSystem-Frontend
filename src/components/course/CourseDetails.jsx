import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Container } from 'react-bootstrap';

const CourseDetails = () => {
    const { course_id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchCourseDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:5002/api/course-details/${course_id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Since response.data is an array, get the first object
                    setCourse(response.data[0]); // Assuming data contains a single object
                } catch (error) {
                    console.error('Error fetching course details:', error);
                }
            };

            fetchCourseDetails();
        }
    }, [course_id]);

    // Log the course data whenever it updates
    useEffect(() => {
        console.log(course);
    }, [course]); // Runs every time the course state changes

    if (!course) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="my-5">
            <Card className="shadow-lg">
                <Card.Header className="bg-primary text-white text-center">
                    <h4>{course.Course_code} - {course.Course_title}</h4>
                </Card.Header>
                <Card.Body>
                    <p><strong>Course Type:</strong> {course.Course_type}</p>
                    <p><strong>Credits:</strong> {course.Couorse_credit}</p>
                    <p><strong>Contact Hours:</strong> {course.Contact_hour}</p> {/* Added contact hours */}
                    <p><strong>Description:</strong> {course.Rationale}</p> {/* Changed to Rationale for description */}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourseDetails;
