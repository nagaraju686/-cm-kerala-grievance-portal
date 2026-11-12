
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [feedbackDone, setFeedbackDone] = useState({});
  const [messages, setMessages] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const fetchGrievances = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/grievances/my-grievances",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setGrievances(response.data.grievances || response.data);
    } catch (error) {
      console.log("Dashboard error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGrievances();
    } else {
      setLoading(false);
    }
  }, [token]);

  // SUBMIT CITIZEN FEEDBACK
  const handleFeedback = async (grievanceId) => {
    try {
      const rating = ratings[grievanceId];
      const comment = comments[grievanceId] || "";

      if (!rating) {
        setMessages((prev) => ({
          ...prev,
          [grievanceId]: "Please select a rating"
        }));
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/feedback/${grievanceId}`,
        {
          rating: Number(rating),
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFeedbackDone((prev) => ({
        ...prev,
        [grievanceId]: true
      }));

      setMessages((prev) => ({
        ...prev,
        [grievanceId]: response.data.message ||
          "Feedback submitted successfully!"
      }));

    } catch (error) {
      setMessages((prev) => ({
        ...prev,
        [grievanceId]:
          error.response?.data?.message ||
          "Feedback submission failed"
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!token) {
    return (
      <div>
        <h2>Please Login First</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Citizen Dashboard</h1>

      <h3>
        Welcome, {user?.name || "Citizen"}
      </h3>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <Link to="/submit-grievance">
        <button>Submit New Grievance</button>
      </Link>

      <h2>My Grievances</h2>

      {loading ? (
        <p>Loading...</p>
      ) : grievances.length === 0 ? (
        <p>No grievances submitted yet.</p>
      ) : (
        grievances.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              margin: "15px 0",
              borderRadius: "8px"
            }}
          >
            <h3>{item.subject}</h3>

            <p>Reference ID: {item.referenceId}</p>
            <p>Category: {item.category}</p>
            <p>District: {item.district}</p>
            <p>Status: {item.status}</p>
            <p>Priority: {item.priority}</p>

            {item.status === "Resolved" && (
              <div>
                <hr />

                <h3>Citizen Feedback</h3>

                {feedbackDone[item._id] ? (
                  <p style={{ color: "green" }}>
                    {messages[item._id]}
                  </p>
                ) : (
                  <>
                    <label>Select Rating:</label>

                    <br />

                    <select
                      value={ratings[item._id] || ""}
                      onChange={(e) =>
                        setRatings((prev) => ({
                          ...prev,
                          [item._id]: e.target.value
                        }))
                      }
                    >
                      <option value="">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>

                    <br /><br />

                    <textarea
                      rows="4"
                      style={{
                        width: "100%",
                        padding: "10px"
                      }}
                      placeholder="Write your feedback..."
                      value={comments[item._id] || ""}
                      onChange={(e) =>
                        setComments((prev) => ({
                          ...prev,
                          [item._id]: e.target.value
                        }))
                      }
                    />

                    <br /><br />

                    <button
                      onClick={() => handleFeedback(item._id)}
                    >
                      Submit Feedback
                    </button>

                    {messages[item._id] && (
                      <p style={{ color: "red" }}>
                        {messages[item._id]}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
