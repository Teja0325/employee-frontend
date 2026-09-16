import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../css/Dashboard.css";

import { getAdminDashboard } from "../services/ApiService";

import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaStar,
  FaArrowUp
} from "react-icons/fa";

function AdminDashboard() {

  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    department: "",
    averageSalary: 0,
    averageRating: 0
  });

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const loadAdminDashboard = async () => {
    try {
      const response = await getAdminDashboard();
      setDashboard(response.data);
    } catch (error) {
      console.log("Error loading admin dashboard:", error);
    }
  };

  const ratingPercent = Math.min(
    100,
    Math.round(((dashboard.averageRating || 0) / 5) * 100)
  );

  return (
    <Layout>
      <div className="dashboard">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Welcome back, Admin 👋 &bull; Managing{" "}
              <strong>{dashboard.department || "Department"}</strong> overview
            </p>
          </div>
          <div className="header-badge">
            <span className="status-dot"></span>
            <span>Live System &bull; {dashboard.department || "General"}</span>
          </div>
        </div>

        {/* TOP 4 STAT CARDS */}
        <div className="cards">
          {/* TOTAL EMPLOYEES */}
          <div className="card">
            <div className="icon purple">
              <FaUsers />
            </div>
            <div className="card-info">
              <h2>{dashboard.totalEmployees}</h2>
              <p>Total Team Members</p>
            </div>
            <span className="trend-badge">
              <FaArrowUp /> Active
            </span>
          </div>

          {/* DEPARTMENT */}
          <div className="card">
            <div className="icon green">
              <FaBuilding />
            </div>
            <div className="card-info">
              <h2>{dashboard.department || "N/A"}</h2>
              <p>Assigned Department</p>
            </div>
            <span className="trend-badge">Verified</span>
          </div>

          {/* AVERAGE SALARY */}
          <div className="card">
            <div className="icon orange">
              <FaMoneyBillWave />
            </div>
            <div className="card-info">
              <h2>
                ₹ {Number(dashboard.averageSalary || 0).toLocaleString("en-IN", {
                  maximumFractionDigits: 0
                })}
              </h2>
              <p>Average Salary</p>
            </div>
            <span className="trend-badge">Monthly</span>
          </div>

          {/* AVERAGE RATING */}
          <div className="card">
            <div className="icon blue">
              <FaStar />
            </div>
            <div className="card-info">
              <h2>{Number(dashboard.averageRating || 0).toFixed(1)} ⭐</h2>
              <p>Performance Score</p>
            </div>
            <span className="trend-badge">{ratingPercent}%</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;  