import React, { useEffect, useState } from 'react';

const PendingRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch pending requests from the backend
        const fetchPendingRequests = async () => {
            try {
                const response = await fetch('http://localhost:5002/api/pending-rescheduling-requests');
                if (!response.ok) {
                    throw new Error('Failed to fetch requests');
                }
                const data = await response.json();
                setPendingRequests(data);
                console.log(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:5002/api/approve-reschedule-request/${id}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to approve request');
            }
            const updatedRequests = pendingRequests.filter(request => request.reschedule_request_id !== id);
            setPendingRequests(updatedRequests);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleReject = async (id) => {
        try {
            const response = await fetch(`http://localhost:5002/api/reject-reschedule-request/${id}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to reject request');
            }
            const updatedRequests = pendingRequests.filter(request => request.reschedule_request_id !== id);
            setPendingRequests(updatedRequests);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Pending Reschedule Requests</h1>

            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-danger">{error}</p>}

            {pendingRequests.length === 0 && !loading && (
                <p className="text-center">No pending requests available.</p>
            )}

            {!loading && pendingRequests.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Original Time</th>
                                <th scope="col">Requested Time</th>
                                <th scope="col">Reason</th>
                                <th scope="col">Course Code</th>
                                <th scope="col">Course Title</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.map((request) => (
                                <tr key={request.reschedule_request_id}>
                                    <td>{new Date(request.original_time).toLocaleString()}</td>
                                    <td>{new Date(request.requested_time).toLocaleString()}</td>
                                    <td>{request.reason}</td>
                                    <td>{request.Course_code}</td>
                                    <td>{request.Course_title}</td>
                                    <td>
                                        <button 
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleApprove(request.reschedule_request_id)}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm ml-2"
                                            onClick={() => handleReject(request.reschedule_request_id)}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
