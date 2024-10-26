import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Component for generating a department schedule.
 * @component
 */
const RoutineGenerator = () => {
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [slotCount, setSlotCount] = useState(4);
    const [slotDuration, setSlotDuration] = useState(60);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [lunchDuration, setLunchDuration] = useState(60);
    const [lunchTime, setLunchTime] = useState('12:00');
    const [schedule, setSchedule] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    /**
     * Fetches department data on component mount.
     * Sets the `departments` state with data from the server.
     * @function
     */
    useEffect(() => {
        axios.get('http://localhost:5002/api/fetch-all-data')
            .then(response => {
                setDepartments(response.data.departments);
                console.log(response.data.departments);
            })
            .catch(error => {
                console.error('Error fetching all data:', error);
            });
    }, []);

    /**
     * Handles department selection.
     * @param {Object} e - Event triggered by the department dropdown change.
     */
    const handleDepartmentChange = (e) => setDepartment(e.target.value);

    /**
     * Handles slot count input change.
     * @param {Object} e - Event triggered by the slot count input change.
     */
    const handleSlotCountChange = (e) => setSlotCount(e.target.value);

    /**
     * Handles slot duration input change.
     * @param {Object} e - Event triggered by the slot duration input change.
     */
    const handleSlotDurationChange = (e) => setSlotDuration(e.target.value);

    /**
     * Handles start time input change.
     * @param {Object} e - Event triggered by the start time input change.
     */
    const handleStartTimeChange = (e) => setStartTime(e.target.value);

    /**
     * Handles end time input change.
     * @param {Object} e - Event triggered by the end time input change.
     */
    const handleEndTimeChange = (e) => setEndTime(e.target.value);

    /**
     * Handles lunch duration input change.
     * @param {Object} e - Event triggered by the lunch duration input change.
     */
    const handleLunchDurationChange = (e) => setLunchDuration(e.target.value);

    /**
     * Handles lunch time input change.
     * @param {Object} e - Event triggered by the lunch time input change.
     */
    const handleLunchTimeChange = (e) => setLunchTime(e.target.value);

    /**
     * Generates a schedule based on the user input and department selection.
     * Fetches the generated schedule from the server and updates the state.
     * Displays an error message if generation fails.
     * @async
     */
    const handleGenerateSchedule = async () => {
        if (!department) {
            alert('Please select a department first!');
            return;
        }

        const scheduleData = {
            department,
            slotCount,
            slotDuration,
            startTime,
            endTime,
            lunchDuration,
            lunchTime
        };

        try {
            const response = await axios.post('http://localhost:5001/api/generate-schedule', scheduleData);
            const transformedData = transformScheduleData(response.data);
            setSchedule(transformedData);
            setError(null);
            setSuccessMessage('Schedule generated successfully!');
        } catch (err) {
            console.error('Error generating schedule:', err);
            setError('Failed to generate schedule.');
            setSchedule([]);
            setSuccessMessage('');
        }
    };

    /**
     * Transforms the server response data into a flat array format for easier display.
     * @param {Object} data - Schedule data from the server.
     * @returns {Array} Transformed schedule data array.
     */
    const transformScheduleData = (data) => {
        const result = [];
        for (const day in data) {
            for (const time in data[day]) {
                for (const year in data[day][time]) {
                    data[day][time][year].forEach((item) => {
                        result.push({
                            id: item.id,
                            dept_id: item.dept_id,
                            day,
                            timeSlot: time,
                            year,
                            ...item
                        });
                    });
                }
            }
        }
        return result;
    };

    /**
     * Navigates back to the home dashboard.
     * @function
     */
    const handleBackToHome = () => navigate('/su-dashboard');

    /**
     * Navigates to the view routine page.
     * @function
     */
    const handleViewRoutine = () => navigate('/view-routine');

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title text-center mb-4">Generate Schedule</h5>

                            <div className="mb-3">
                                <select className="form-select" value={department} onChange={handleDepartmentChange}>
                                    <option value="" disabled>Select Department Name</option>
                                    {departments.map((dept, index) => (
                                        <option key={index} value={dept.Dept_Name}>{dept.Dept_Name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Number of Daily Slots</label>
                                <input type="number" className="form-control" value={slotCount} onChange={handleSlotCountChange} min="1" />
                            </div>

                            <div className="mb-3">
                                <label>Duration of Each Slot (minutes)</label>
                                <input type="number" className="form-control" value={slotDuration} onChange={handleSlotDurationChange} min="15" />
                            </div>

                            <div className="mb-3">
                                <label>Class Day Start Time</label>
                                <input type="time" className="form-control" value={startTime} onChange={handleStartTimeChange} />
                            </div>

                            <div className="mb-3">
                                <label>Class Day End Time</label>
                                <input type="time" className="form-control" value={endTime} onChange={handleEndTimeChange} />
                            </div>

                            <div className="mb-3">
                                <label>Lunch Break Duration (minutes)</label>
                                <input type="number" className="form-control" value={lunchDuration} onChange={handleLunchDurationChange} min="15" />
                            </div>

                            <div className="mb-3">
                                <label>Lunch Break Time</label>
                                <input type="time" className="form-control" value={lunchTime} onChange={handleLunchTimeChange} />
                            </div>

                            <button className="btn btn-primary w-100" onClick={handleGenerateSchedule}>Generate Schedule</button>

                            {error && <p className="mt-3 text-danger text-center">{error}</p>}
                            {successMessage && <div className="mt-3 alert alert-success text-center" role="alert">{successMessage}</div>}
                        </div>
                    </div>
                    <div className="d-grid gap-2 justify-content-md m-2">
                        <button className="btn btn-success" onClick={handleViewRoutine}>View Routine</button>
                        <button className="btn btn-dark" onClick={handleBackToHome}>Back to Home</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutineGenerator;
