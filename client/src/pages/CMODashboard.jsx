
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid
} from "recharts";

const API = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

const districts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta",
  "Alappuzha", "Kottayam", "Idukki", "Ernakulam",
  "Thrissur", "Palakkad", "Malappuram", "Kozhikode",
  "Wayanad", "Kannur", "Kasaragod"
];

const categories = [
  "Roads", "Water Supply", "Electricity", "Health",
  "Education", "Police", "Revenue", "Other"
];

const statuses = [
  "Submitted", "Under Review", "In Progress",
  "Resolved", "Reopened"
];

const priorities = ["Low", "Medium", "High"];

function CMODashboard() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState({});
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [districtFilter, setDistrictFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [dashboardResponse, grievanceResponse] =
        await Promise.all([
          axios.get(`${API}/cmo/dashboard`, config),
          axios.get(`${API}/cmo/grievances`, config)
        ]);

      setStatistics(
        dashboardResponse.data.statistics || {}
      );

      const grievanceData =
        grievanceResponse.data.grievances ||
        (Array.isArray(grievanceResponse.data)
          ? grievanceResponse.data
          : []);

      setGrievances(grievanceData);

    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to load CMO dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredGrievances = grievances.filter((grievance) => (
    (!districtFilter || grievance.district === districtFilter) &&
    (!categoryFilter || grievance.category === categoryFilter) &&
    (!statusFilter || grievance.status === statusFilter) &&
    (!priorityFilter || grievance.priority === priorityFilter)
  ));

  const statusData = statuses.map(name => ({
    name,
    value: grievances.filter(g => g.status === name).length
  }));

  const priorityData = priorities.map(name => ({
    name,
    count: grievances.filter(g => g.priority === name).length
  }));

  const districtData = districts
    .map(name => ({
      name,
      count: grievances.filter(g => g.district === name).length
    }))
    .filter(item => item.count > 0);

  const statCards = [
    { title: "Total Grievances", value: statistics.total ?? grievances.length },
    { title: "Submitted", value: statistics.submitted ?? 0 },
    { title: "Under Review", value: statistics.underReview ?? 0 },
    { title: "In Progress", value: statistics.inProgress ?? 0 },
    { title: "Resolved", value: statistics.resolved ?? 0 },
    { title: "Reopened", value: statistics.reopened ?? 0 }
  ];

  const cardStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  };

  const selectStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minWidth: "180px"
  };

  // ATTACHMENT URL
  const getAttachmentUrl = (filePath) => {
    if (!filePath) return "";

    const cleanPath = filePath
      .replace(/\\/g, "/")
      .replace(/^.*?uploads\//, "");

    return `${SERVER_URL}/uploads/${cleanPath}`;
  };

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading dashboard...</h2>;
  }

  return (
    <div style={{
      padding: "25px",
      background: "#f5f7fb",
      minHeight: "100vh"
    }}>

      {/* HEADER */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px"
      }}>
        <div>
          <h1>CMO Admin Dashboard</h1>
          <p>Chief Minister's Public Grievance Redressal Portal</p>
        </div>

        <div style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap"
        }}>
          <button onClick={fetchDashboard}>Refresh</button>

          <Link to="/assign-grievance">
            <button>Assign Grievance</button>
          </Link>

          <Link to="/cmo-reports">
            <button>CMO Reports</button>
          </Link>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* STATISTICS */}
      <h2 style={{ marginTop: "30px" }}>
        Grievance Statistics
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "15px"
      }}>
        {statCards.map(card => (
          <div key={card.title} style={cardStyle}>
            <h3>{card.title}</h3>
            <h2>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <h2 style={{ marginTop: "35px" }}>
        Grievance Analytics
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        <div style={cardStyle}>
          <h3>Status Overview</h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={85}
                label
              >
                {statusData.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={[
                      "#2563eb", "#f59e0b", "#8b5cf6",
                      "#16a34a", "#dc2626"
                    ][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3>Priority Overview</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3>District-wise Grievances</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={districtData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={75}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FILTERS */}
      <h2 style={{ marginTop: "35px" }}>
        All Grievances
      </h2>

      <div style={{
        ...cardStyle,
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px"
      }}>
        <select
          style={selectStyle}
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
        >
          <option value="">All Districts</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          style={selectStyle}
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          {priorities.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button onClick={() => {
          setDistrictFilter("");
          setCategoryFilter("");
          setStatusFilter("");
          setPriorityFilter("");
        }}>
          Clear Filters
        </button>
      </div>

      <p>Showing {filteredGrievances.length} grievance(s)</p>

      {/* GRIEVANCE LIST */}
      <div style={{ display: "grid", gap: "15px" }}>
        {filteredGrievances.length === 0 ? (
          <div style={cardStyle}>No grievances found.</div>
        ) : (
          filteredGrievances.map(grievance => (
            <div key={grievance._id} style={cardStyle}>
              <h3>{grievance.subject}</h3>

              <p>
                <strong>Reference ID:</strong>{" "}
                {grievance.referenceId}
              </p>

              <p>
                <strong>District:</strong> {grievance.district}
              </p>

              <p>
                <strong>Category:</strong> {grievance.category}
              </p>

              <p>
                <strong>Priority:</strong> {grievance.priority}
              </p>

              <p>
                <strong>Status:</strong> {grievance.status}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {grievance.department || "Not Assigned"}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {grievance.description}
              </p>

              <p>
                <strong>Submitted:</strong>{" "}
                {new Date(grievance.createdAt).toLocaleString()}
              </p>

              {/* ATTACHMENTS */}
              <hr />
              <h4>Uploaded Attachments</h4>

              {grievance.attachments &&
              grievance.attachments.length > 0 ? (
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px"
                }}>
                  {grievance.attachments.map(file => {
                    const fileUrl = getAttachmentUrl(file.filePath);
                    const isImage =
                      file.fileType?.startsWith("image/") ||
                      /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileName || "");

                    return (
                      <div
                        key={file._id}
                        style={{
                          border: "1px solid #ddd",
                          padding: "12px",
                          borderRadius: "8px",
                          maxWidth: "240px"
                        }}
                      >
                        <p>{file.fileName}</p>

                        {isImage ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={fileUrl}
                              alt={file.fileName}
                              style={{
                                width: "200px",
                                maxHeight: "160px",
                                objectFit: "contain"
                              }}
                            />
                          </a>
                        ) : (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open / View PDF
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No attachments uploaded.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CMODashboard;
