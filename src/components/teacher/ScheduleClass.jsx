import React from 'react';
import { useParams } from 'react-router-dom';  // Import the hook

function ScheduleClass() {
  const { teacher_id } = useParams();

  return (
    <div>
      <h1>Schedule Class</h1>
      <p>Teacher ID: {teacher_id}</p>
    </div>
  );
}

export default ScheduleClass;
