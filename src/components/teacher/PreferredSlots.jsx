import React from 'react';
import { useParams } from 'react-router-dom';  // Import the hook

function PreferredSlots() {
  const { teacher_id } = useParams();

  return (
    <div>
      <h1>Preferred Slots</h1>
      <p>Teacher ID: {teacher_id}</p>
    </div>
  );
}

export default PreferredSlots;
