import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ScheduleClass = () => {
    const [classes, setClasses] = useState([]);
    const { teacher_id } = useParams();

    // Fetch scheduled classes when the component loads or teacher_id changes
    useEffect(() => {
        console.log('Fetching data for teacher ID:', teacher_id);
        fetchScheduledClasses();
    }, [teacher_id]);

    // Function to fetch scheduled classes
    const fetchScheduledClasses = async () => {
        try {
            const response = await axios.get(`http://localhost:5002/api/scheduled-classes/${teacher_id}`);
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching scheduled classes:', error);
        }
    };

    // Function to confirm a scheduled class
    const handleConfirm = async (scheduledClassId) => {
        try {
            await axios.post(`http://localhost:5002/api/confirm-class/${scheduledClassId}`);
            fetchScheduledClasses(); // Refresh list after confirmation
        } catch (error) {
            console.error('Error confirming class:', error);
        }
    };

    // Function to cancel a scheduled class
    const handleCancel = async (scheduledClassId) => {
        try {
            await axios.post(`http://localhost:5002/api/cancel-class/${scheduledClassId}`);
            fetchScheduledClasses(); // Refresh list after cancellation
        } catch (error) {
            console.error('Error canceling class:', error);
        }
    };

    // Function to revert a confirmed class back to scheduled
    const handleSetNotConfirmed = async (scheduledClassId) => {
        try {
            await axios.post(`http://localhost:5002/api/set-not-confirmed/${scheduledClassId}`);
            fetchScheduledClasses(); // Refresh list after status change
        } catch (error) {
            console.error('Error setting class to not confirmed:', error);
        }
    };

    // Helper function to filter classes by their status
    const filterClassesByStatus = (status) => {
        return classes.filter((scheduledClass) => scheduledClass.status === status);
    };

    // Table rendering function
    const renderTable = (filteredClasses, title, badgeClass, actionButtons) => (
        <div className="mb-5">
            <h4 className="text-center">{title}</h4>
            {filteredClasses.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Date</th>
                                <th>Course Code</th>
                                <th>Course Title</th>
                                <th>Room No</th>
                                <th>Time</th>
                                <th>Status</th>
                                {actionButtons && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map((scheduledClass) => (
                                <tr key={scheduledClass.scheduled_class_id}>
                                    <td>{new Date(scheduledClass.class_date).toLocaleDateString()}</td>
                                    <td>{scheduledClass.course_code}</td>
                                    <td>{scheduledClass.course_title}</td>
                                    <td>{scheduledClass.Room_no}</td>
                                    <td>{scheduledClass.startTime} - {scheduledClass.endTime}</td>
                                    <td>
                                        <span className={`badge ${badgeClass}`}>{scheduledClass.status}</span>
                                    </td>
                                    {actionButtons && (
                                        <td>
                                            {actionButtons(scheduledClass)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info text-center">No {title.toLowerCase()} classes found.</div>
            )}
        </div>
    );

    // Action buttons for different statuses
    const renderScheduledActionButtons = (scheduledClass) => (
        <>
            <button
                className="btn btn-success btn-sm mr-2"
                onClick={() => handleConfirm(scheduledClass.scheduled_class_id)}
            >
                Confirm
            </button>
            <button
                className="btn btn-danger btn-sm"
                onClick={() => handleCancel(scheduledClass.scheduled_class_id)}
            >
                Cancel
            </button>
        </>
    );

    const renderConfirmedActionButtons = (scheduledClass) => (
        <button
            className="btn btn-warning btn-sm"
            onClick={() => handleSetNotConfirmed(scheduledClass.scheduled_class_id)}
        >
            Set Not Confirmed
        </button>
    );

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Scheduled Classes</h2>

            {/* Render Scheduled Classes Table */}
            {renderTable(
                filterClassesByStatus('Scheduled'),
                'Scheduled Classes',
                'bg-warning text-dark',
                renderScheduledActionButtons
            )}

            {/* Render Confirmed Classes Table */}
            {renderTable(
                filterClassesByStatus('Confirmed'),
                'Confirmed Classes',
                'bg-success text-light',
                renderConfirmedActionButtons
            )}

            {/* Render Conducted Classes Table */}
            {renderTable(
                filterClassesByStatus('Conducted'),
                'Conducted Classes',
                'bg-primary text-light'
            )}

            {/* Render Cancelled Classes Table */}
            {renderTable(
                filterClassesByStatus('Cancelled'),
                'Cancelled Classes',
                'bg-danger text-light'
            )}
        </div>
    );
};

export default ScheduleClass;
