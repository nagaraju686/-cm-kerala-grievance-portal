
import React, { useEffect, useState } from "react";
import axios from "axios";

function CMOReports() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/cmo/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAssignments(response.data.assignments || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load reports"
      );
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
    } else {
      setError("Please login as CMO");
    }
  }, [token]);

  const handleReview = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/cmo/review-report/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      setError("");
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || "Review failed");
    }
  };

  const handleResolve = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/cmo/resolve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message);
      setError("");
      fetchReports();
    } catch (err) {
      setError(err.response?.data?.message || "Resolve failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>CMO Action Taken Reports</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {assignments.length === 0 ? (
        <p>No action taken reports available.</p>
      ) : (
        assignments.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px"
            }}
          >
            <h3>{item.grievance?.subject}</h3>
            <p>Reference ID: {item.grievance?.referenceId}</p>
            <p>Department: {item.department?.name}</p>
            <p>Officer: {item.officer?.name || "Not available"}</p>
            <p>Grievance Status: {item.grievance?.status}</p>

            <h4>Action Taken Report</h4>
            <p>{item.actionTakenReport}</p>
            <p>Report Status: {item.reportStatus}</p>

            {item.reportStatus === "Submitted" && (
              <button onClick={() => handleReview(item._id)}>
                Review Report
              </button>
            )}

            {item.reportStatus === "Reviewed" &&
              item.grievance?.status !== "Resolved" && (
                <button
                  onClick={() => handleResolve(item.grievance._id)}
                >
                  Resolve Grievance
                </button>
              )}
          </div>
        ))
      )}
    </div>
  );
}

export default CMOReports;
