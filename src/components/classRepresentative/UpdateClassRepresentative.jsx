import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateClassRepresentative = () => {
    const { exam_year_id } = useParams();
    const [students, setStudents] = useState([]);
    const [examYearDetails, setExamYearDetails] = useState(null); // State for exam year details
    const [selectedStudent, setSelectedStudent] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [currentRepresentatives, setCurrentRepresentatives] = useState({ Male: null, Female: null });

    // Function to fetch current representatives
    const fetchCurrentRepresentatives = async () => {
        if (students.length === 0) return; // Ensure students are available before proceeding
        try {
            const response = await axios.get(`http://localhost:5002/api/class-representative/${exam_year_id}`);
            const representatives = { Male: null, Female: null };

            response.data.forEach((rep) => {
                const representative = { ...rep };
                // Find the matching student to get the Name and Class_roll
                const student = students.find((s) => s.student_id === rep.student_id);
                if (student) {
                    representative.Name = student.Name;
                    representative.Class_roll = student.Class_roll;
                }

                if (rep.role === 'Male') representatives.Male = representative;
                if (rep.role === 'Female') representatives.Female = representative;
            });

            setCurrentRepresentatives(representatives);
        } catch (error) {
            console.error('Error fetching class representatives:', error);
        }
    };

    // Fetch students and exam year details
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students
                const studentsResponse = await axios.get(`http://localhost:5002/api/students-by-exam-year-id/${exam_year_id}`);
                setStudents(studentsResponse.data);

                // Fetch exam year details
                const examYearResponse = await axios.get(`http://localhost:5002/api/exam-year-details/${exam_year_id}`);
                setExamYearDetails(examYearResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [exam_year_id]);

    // Run after students are fetched
    useEffect(() => {
        if (students.length > 0) {
            fetchCurrentRepresentatives();
        }
    }, [students]);

    const handleStudentChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedStudent || !role) {
            setMessage('Please select a student and a role.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:5002/api/update-class-representative', {
                exam_year_id: exam_year_id,
                student_id: selectedStudent,
                role
            });
            setMessage(response.data.message);
            // Update current representatives after successful update
            await fetchCurrentRepresentatives();
        } catch (error) {
            console.error('Error updating class representative:', error);
            setMessage('Failed to update class representative.');
        }
    };

    return (
        <div className="container mt-5">
            {/* Display exam year details if available */}
            {examYearDetails && (
                <div className="card mb-4 shadow-sm border-light">
                    <div className="card-header bg-primary text-white">
                        <h5 className="card-title mb-0 text-center">Exam Year Details</h5>
                    </div>
                    <div className="card-body text-center">
                        <p><strong>{examYearDetails.Year}</strong> Year, <strong>{examYearDetails.Semester}</strong> Semester</p>
                        <p><strong>Exam Year:</strong> {examYearDetails.Exam_year}</p>
                        <p><strong>Education Level:</strong> {examYearDetails.Education_level}</p>
                    </div>
                </div>
            )}

            {message && <div className="alert alert-info mt-3 text-center">{message}</div>}

            <div className="card mb-4 shadow-sm border-light">
                <div className="card-header bg-info text-white">
                    <h5 className="card-title mb-0 text-center">Current Representatives</h5>
                </div>
                <div className="card-body text-center">
                    <h4 className="text-primary"><strong>Male:</strong></h4>
                    <p className="text-muted">
                        {currentRepresentatives.Male ? `${currentRepresentatives.Male.Name} (Roll: ${currentRepresentatives.Male.Class_roll})` : 'None'}
                    </p>
                    <h4 className="text-primary"><strong>Female:</strong></h4>
                    <p className="text-muted">
                        {currentRepresentatives.Female ? `${currentRepresentatives.Female.Name} (Roll: ${currentRepresentatives.Female.Class_roll})` : 'None'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="card p-4 rounded shadow-sm">
                <div className="form-group mb-3">
                    <label htmlFor="student">Select Student:</label>
                    <select id="student" className="form-control" value={selectedStudent} onChange={handleStudentChange}>
                        <option value="">Select a Student</option>
                        {students.map((student) => (
                            <option key={student.student_id} value={student.student_id}>
                                {student.Name} (Roll: {student.Class_roll})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="role">Role:</label>
                    <select id="role" className="form-control" value={role} onChange={handleRoleChange}>
                        <option value="">Select Role</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-success btn-block mt-3">Update Representative</button>
            </form>
        </div>
    );
};

export default UpdateClassRepresentative;
