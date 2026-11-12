
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SubmitGrievance() {
  const navigate = useNavigate();

  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const districts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod"
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Create grievance
      const response = await axios.post(
        "http://localhost:5000/api/grievances/submit",
        {
          district,
          category,
          subject,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const grievance = response.data.grievance;

      // Upload optional attachment
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.post(
          `http://localhost:5000/api/uploads/${grievance._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      alert(
        "Grievance submitted successfully!\nReference ID: " +
        grievance.referenceId
      );

      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Grievance submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "650px", margin: "auto" }}>
      <h1>Submit Grievance</h1>

      <form onSubmit={handleSubmit}>

        <label>District</label>
        <br />

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        >
          <option value="">Select District</option>

          {districts.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <br /><br />

        <label>Category</label>
        <br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Police">Police</option>
          <option value="Roads">Roads</option>
          <option value="Water">Water Resources</option>
          <option value="Electricity">Electricity</option>
          <option value="Other">Other</option>
        </select>

        <br /><br />

        <label>Subject</label>
        <br />

        <input
          type="text"
          placeholder="Enter complaint subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <br /><br />

        <label>Description</label>
        <br />

        <textarea
          placeholder="Explain your complaint"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          required
        />

        <br /><br />

        <label>Upload Image or PDF (Optional)</label>
        <br />

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <p>Maximum file size: 5 MB</p>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Grievance"}
        </button>

      </form>
    </div>
  );
}

export default SubmitGrievance;
