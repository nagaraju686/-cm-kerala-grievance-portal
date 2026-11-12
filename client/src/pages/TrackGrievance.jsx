
import React, { useState } from "react";
import axios from "axios";

function TrackGrievance() {
  const [referenceId, setReferenceId] = useState("");
  const [grievance, setGrievance] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setGrievance(null);
    setHistory([]);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/grievances/track/${referenceId.trim()}`
      );

      setGrievance(response.data.grievance);
      setHistory(response.data.history || []);

    } catch (err) {
      setError(
        err.response?.data?.message || "Grievance not found"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: "750px",
      margin: "40px auto",
      padding: "20px"
    }}>
      <h1>Track Your Grievance</h1>

      <form onSubmit={handleTrack}>
        <input
          type="text"
          placeholder="Enter Reference ID"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            boxSizing: "border-box"
          }}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Track Grievance"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {grievance && (
        <div style={{ marginTop: "25px" }}>
          <h2>Grievance Details</h2>

          <p><b>Reference ID:</b> {grievance.referenceId}</p>
          <p><b>Subject:</b> {grievance.subject}</p>
          <p><b>Description:</b> {grievance.description}</p>
          <p><b>District:</b> {grievance.district}</p>
          <p><b>Category:</b> {grievance.category}</p>
          <p><b>Status:</b> {grievance.status}</p>
          <p><b>Priority:</b> {grievance.priority}</p>
          <p><b>Department:</b> {grievance.department}</p>
          <p>
            <b>Submitted:</b>{" "}
            {new Date(grievance.createdAt).toLocaleString()}
          </p>

          <hr />

          <h2>Grievance Status History</h2>

          {history.length === 0 ? (
            <p>No history available yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                style={{
                  borderLeft: "4px solid #2563eb",
                  padding: "12px",
                  marginBottom: "15px",
                  background: "#f3f4f6",
                  borderRadius: "5px"
                }}
              >
                <h3>{item.status}</h3>

                <p>
                  <b>Remarks:</b>{" "}
                  {item.remarks || "No remarks"}
                </p>

                <p>
                  <b>Updated By:</b>{" "}
                  {item.updatedBy?.name || "System / Unknown"}
                  {item.updatedBy?.role
                    ? ` (${item.updatedBy.role})`
                    : ""}
                </p>

                <p>
                  <b>Date:</b>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TrackGrievance;
