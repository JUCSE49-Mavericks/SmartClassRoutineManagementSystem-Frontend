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
    const [scheduleData, setScheduleData] = useState(null); // State for schedule data
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
            const transformedData = scheduleData;
            console.log(response);
            setScheduleData(response.data.data.scheduleData); // Update the state with the response data
            if(transformedData)setSuccessMessage('Schedule generated successfully & saved in DATABASE!');
        } catch (err) {
            console.error('Error generating schedule:', err);
            setError('Failed to generate schedule.');
            setSchedule([]);
            setSuccessMessage('');
        }
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
                <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h5 className="card-title mb-0">Generate Schedule</h5>
        </div>

        <div className="card-body p-4">
          <form>
            <div className="mb-4">
              <label className="form-label">Select Department</label>
              <select
                className="form-select"
                value={department}
                onChange={handleDepartmentChange}
              >
                <option value="" disabled>
                  Choose Department Name
                </option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.Dept_Name}>
                    {dept.Dept_Name}
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Daily Slot Count</label>
                <input
                  type="number"
                  className="form-control"
                  value={slotCount}
                  onChange={handleSlotCountChange}
                  min="1"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Slot Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={slotDuration}
                  onChange={handleSlotDurationChange}
                  min="15"
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Day Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Day End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
            </div>

            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <label className="form-label">Lunch Break Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={lunchDuration}
                  onChange={handleLunchDurationChange}
                  min="15"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Lunch Break Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={lunchTime}
                  onChange={handleLunchTimeChange}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 mt-4"
              onClick={handleGenerateSchedule}
            >
              Generate Schedule
            </button>

            {error && (
              <p className="mt-3 text-danger text-center">
                <i className="bi bi-exclamation-circle"></i> {error}
              </p>
            )}
            {successMessage && (
              <div
                className="mt-3 alert alert-success text-center"
                role="alert"
              >
                <i className="bi bi-check-circle-fill"></i> {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>

                    
                    {/* Render Schedule Data if available */}
{scheduleData && (
    <div className="mt-4">
        <div className="card border-primary mb-3">
            <div className="card-header">
                <h5 className="mb-0">Schedule Data</h5>
            </div>
            <div className="card-body">
                <p className="card-text">
                    <strong>Department:</strong> <span className="text-primary">{scheduleData.department}</span>
                </p>
                <hr />
                
                <h6>Lunch Break</h6>
                <table className="table table-bordered">
                    <thead>
                        <tr className="table-primary">
                            <th>Duration (minutes)</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{scheduleData.lunchBreak.duration}</td>
                            <td>{scheduleData.lunchBreak.startTime}</td>
                            <td>{scheduleData.lunchBreak.endTime}</td>
                        </tr>
                    </tbody>
                </table>
                
                <hr />
                
                <h6>Slots</h6>
                <table className="table table-striped">
                    <thead>
                        <tr className="table-primary">
                            <th>Slot Number</th>
                            <th>Duration (minutes)</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.slots.map((slot, index) => (
                            <tr key={index}>
                                <td>{slot.slotNumber}</td>
                                <td>{slot.duration}</td>
                                <td>{slot.startTime}</td>
                                <td>{slot.endTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)}



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
