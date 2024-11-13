import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RescheduleClass = ({ scheduledClassId, onClose, refreshClasses }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [newDate, setNewDate] = useState('');
    const [newTimeSlotId, setNewTimeSlotId] = useState('');

    // Fetch available time slots from the backend
    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get('http://localhost:5002/api/time-slots');
                setTimeSlots(response.data);
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        };
        fetchTimeSlots();
    }, []);

    // Handler to reschedule a class
    const handleReschedule = async () => {
        try {
            await axios.post(`http://localhost:5002/api/reschedule-class/${scheduledClassId}`, {
                new_date: newDate,
                new_time_slot_id: newTimeSlotId,
            });
            alert('Class rescheduled successfully');
            refreshClasses();
            onClose();
        } catch (error) {
            console.error('Error rescheduling class:', error);
            alert('Failed to reschedule class');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h4>Reschedule Class</h4>
                <label htmlFor="newDate">New Class Date:</label>
                <input
                    type="date"
                    id="newDate"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="form-control"
                />

                <label htmlFor="timeSlot">Select Time Slot:</label>
                <select
                    id="timeSlot"
                    value={newTimeSlotId}
                    onChange={(e) => setNewTimeSlotId(e.target.value)}
                    className="form-control"
                >
                    <option value="">Select a Time Slot</option>
                    {timeSlots.map((slot) => (
                        <option key={slot.time_slot_id} value={slot.time_slot_id}>
                            {`${slot.startTime} - ${slot.endTime}`}
                        </option>
                    ))}
                </select>

                <button className="btn btn-primary mt-3" onClick={handleReschedule}>
                    Reschedule
                </button>
                <button className="btn btn-secondary mt-3" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RescheduleClass;
