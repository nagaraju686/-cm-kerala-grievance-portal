
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function AssignGrievance() {
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [grievanceId, setGrievanceId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [remarks, setRemarks] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const getArray = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.users)) return data.users;
    return [];
  };

  const fetchData = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (!token) {
        setMessage("Please login as CMO");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const results = await Promise.allSettled([
        axios.get(`${API}/cmo/grievances`, { headers }),
        axios.get(`${API}/departments`, { headers }),
        axios.get(`${API}/cmo/officers`, { headers })
      ]);

      const errors = [];

      if (results[0].status === "fulfilled") {
        setGrievances(
          getArray(results[0].value.data, "grievances")
        );
      } else {
        setGrievances([]);
        errors.push("Grievances API failed");
      }

      if (results[1].status === "fulfilled") {
        setDepartments(
          getArray(results[1].value.data, "departments")
        );
      } else {
        setDepartments([]);
        errors.push("Departments API failed");
      }

      if (results[2].status === "fulfilled") {
        setOfficers(
          getArray(results[2].value.data, "officers")
        );
      } else {
        setOfficers([]);
        errors.push("Officers API failed");
      }

      if (errors.length > 0) {
        setMessage(errors.join(" | "));
      } else {
        setMessage("Data loaded successfully");
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${API}/assignments`,
        {
          grievanceId,
          departmentId,
          officerId,
          remarks
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Grievance assigned successfully!");

      setGrievanceId("");
      setDepartmentId("");
      setOfficerId("");
      setRemarks("");

      await fetchData();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Assignment failed"
      );
    }
  };

  return (
    <div style={{
      maxWidth: "650px",
      margin: "40px auto",
      padding: "20px"
    }}>
      <h1>Assign Grievance</h1>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <p>
            Grievances: {grievances.length} |
            Departments: {departments.length} |
            Officers: {officers.length}
          </p>

          <form onSubmit={handleAssign}>
            <label>Select Grievance</label>
            <br />

            <select
              value={grievanceId}
              onChange={(e) => setGrievanceId(e.target.value)}
              required
            >
              <option value="">Select Grievance</option>

              {grievances.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.referenceId} - {item.subject}
                </option>
              ))}
            </select>

            <br /><br />

            <label>Select Department</label>
            <br />

            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>

              {departments.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            <br /><br />

            <label>Select Officer</label>
            <br />

            <select
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              required
            >
              <option value="">Select Officer</option>

              {officers.map((officer) => (
                <option key={officer._id} value={officer._id}>
                  {officer.name} - {officer.email}
                </option>
              ))}
            </select>

            <br /><br />

            <label>Assignment Remarks</label>
            <br />

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter assignment remarks"
              rows="4"
            />

            <br /><br />

            <button
              type="submit"
              disabled={
                !grievanceId ||
                !departmentId ||
                !officerId
              }
            >
              Assign Grievance
            </button>
          </form>

          <br />

          <button onClick={fetchData}>
            Refresh Data
          </button>
        </>
      )}
    </div>
  );
}

export default AssignGrievance;
