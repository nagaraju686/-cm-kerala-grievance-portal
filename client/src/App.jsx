
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitGrievance from "./pages/SubmitGrievance";
import TrackGrievance from "./pages/TrackGrievance";
import CMODashboard from "./pages/CMODashboard";
import AssignGrievance from "./pages/AssignGrievance";
import OfficerDashboard from "./pages/OfficerDashboard";
import CMOReports from "./pages/CMOReports";

function Home() {
  return (
    <div>
      <nav>
        <h2>CM Kerala</h2>

        <div>
          <Link to="/">Home</Link>{" "}
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>{" "}
          <Link to="/dashboard">Citizen Dashboard</Link>
        </div>
      </nav>

      <main>
        <h1>Chief Minister's Public Grievance Redressal Portal</h1>

        <p>
          A platform for citizens to submit and track their grievances.
        </p>

        <Link to="/submit-grievance">
          Submit Grievance
        </Link>

        <br /><br />

        <Link to="/track-grievance">
          Track Grievance
        </Link>

        <br /><br />

        <Link to="/cmo-dashboard">
          CMO Dashboard
        </Link>

        <br /><br />

        <Link to="/assign-grievance">
          Assign Grievance
        </Link>

        <br /><br />

        <Link to="/officer-dashboard">
          Officer Dashboard
        </Link>

        <br /><br />

        <Link to="/cmo-reports">
          CMO Reports
        </Link>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/submit-grievance"
          element={<SubmitGrievance />}
        />

        <Route
          path="/track-grievance"
          element={<TrackGrievance />}
        />

        <Route
          path="/cmo-dashboard"
          element={<CMODashboard />}
        />

        <Route
          path="/assign-grievance"
          element={<AssignGrievance />}
        />

        <Route
          path="/officer-dashboard"
          element={<OfficerDashboard />}
        />

        <Route
          path="/cmo-reports"
          element={<CMOReports />}
        />

        <Route
          path="*"
          element={
            <div>
              <h1>404 - Page Not Found</h1>
              <Link to="/">Go to Home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
