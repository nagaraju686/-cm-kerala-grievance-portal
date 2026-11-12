
import React, { useEffect, useState } from "react";
import axios from "axios";

function OfficerDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [reports, setReports] = useState({});
  const [statuses, setStatuses] = useState({});
  const [messages, setMessages] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // FETCH OFFICER ASSIGNMENTS
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/officer/my-assignments",
        { headers }
      );

      console.log("Officer API Response:", response.data);

      const list = Array.isArray(response.data.assignments)
        ? response.data.assignments
        : [];

      setAssignments(list);

    } catch (err) {
      console.error("Fetch error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load assignments"
      );

      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAssignments();
    } else {
      setError("Please login first");
      setLoading(false);
    }
  }, []);

  // UPDATE STATUS
  const handleStatusUpdate = async (grievanceId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/officer/update-status/${grievanceId}`,
        {
          status: statuses[grievanceId] || "Under Review",
          remarks: "Officer updated grievance status"
        },
        { headers }
      );

      setMessages((prev) => ({
        ...prev,
        [grievanceId]: "Status updated successfully!"
      }));

      fetchAssignments();

    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [grievanceId]:
          err.response?.data?.message || "Status update failed"
      }));
    }
  };

  // SUBMIT ACTION TAKEN REPORT
  const handleReportSubmit = async (grievanceId) => {
    const report = reports[grievanceId]?.trim();

    if (!report) {
      setMessages((prev) => ({
        ...prev,
        [grievanceId]: "Please enter action taken report"
      }));
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/officer/submit-report/${grievanceId}`,
        {
          actionTakenReport: report
        },
        { headers }
      );

      setMessages((prev) => ({
        ...prev,
        [grievanceId]: "Action Taken Report submitted successfully!"
      }));

      setReports((prev) => ({
        ...prev,
        [grievanceId]: ""
      }));

      fetchAssignments();

    } catch (err) {
      setMessages((prev) => ({
        ...prev,
        [grievanceId]:
          err.response?.data?.message || "Report submission failed"
      }));
    }
  };

  return (
    <div style={{
      maxWidth: "1100px",
      margin: "auto",
      padding: "30px"
    }}>
      <h1>Officer Dashboard</h1>

      <button onClick={fetchAssignments}>
        Refresh
      </button>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      <h2>My Assigned Grievances</h2>

      {loading ? (
        <p>Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p>No grievances assigned yet.</p>
      ) : (
        <>
          <h3>Total Assignments: {assignments.length}</h3>

          {assignments.map((item) => {
            const grievance = item.grievance;
            const grievanceId = grievance?._id;

            if (!grievanceId) {
              return (
                <div key={item._id}>
                  <p>Grievance details unavailable for this assignment.</p>
                </div>
              );
            }

            return (
              <div
                key={item._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "20px",
                  marginBottom: "20px",
                  borderRadius: "8px"
                }}
              >
                <h3>{grievance.subject}</h3>

                <p>
                  Reference ID: {grievance.referenceId}
                </p>

                <p>
                  Department: {item.department?.name || "Not available"}
                </p>

                <p>
                  District: {grievance.district}
                </p>

                <p>
                  Category: {grievance.category}
                </p>

                <p>
                  Priority: {grievance.priority}
                </p>

                <p>
                  Description: {grievance.description}
                </p>

                <p>
                  Status: <strong>{grievance.status}</strong>
                </p>

                <p>
                  CMO Remarks: {item.remarks || "No remarks"}
                </p>

                <hr />

                <h4>Update Grievance Status</h4>

                <select
                  value={
                    statuses[grievanceId] ||
                    (grievance.status === "In Progress"
                      ? "In Progress"
                      : "Under Review")
                  }
                  onChange={(e) =>
                    setStatuses((prev) => ({
                      ...prev,
                      [grievanceId]: e.target.value
                    }))
                  }
                >
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                </select>

                <button
                  onClick={() => handleStatusUpdate(grievanceId)}
                >
                  Update Status
                </button>

                <hr />

                <h4>Action Taken Report</h4>

                <textarea
                  rows="5"
                  style={{
                    width: "100%",
                    padding: "10px",
                    boxSizing: "border-box"
                  }}
                  placeholder="Enter investigation details and action taken..."
                  value={reports[grievanceId] || ""}
                  onChange={(e) =>
                    setReports((prev) => ({
                      ...prev,
                      [grievanceId]: e.target.value
                    }))
                  }
                />

                <br /><br />

                <button
                  onClick={() => handleReportSubmit(grievanceId)}
                >
                  Submit Action Taken Report
                </button>

                {item.actionTakenReport && (
                  <div>
                    <h4>Previously Submitted Report</h4>
                    <p>{item.actionTakenReport}</p>
                    <p>Report Status: {item.reportStatus}</p>
                  </div>
                )}

                {messages[grievanceId] && (
                  <p style={{ color: "green" }}>
                    {messages[grievanceId]}
                  </p>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default OfficerDashboard;
