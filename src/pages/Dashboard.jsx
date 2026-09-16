import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "../css/Dashboard.css";
import { getDashboardStats } from "../services/ApiService";

import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaStar,
  FaArrowUp,
  FaChartPie,
  FaTasks,
  FaAward,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

const DEPT_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#14b8a6"  // Teal
];

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    averageRating: 0,
    departmentDistribution: [],
    headcountTrend: [],
    projectHealth: {
      totalProjects: 0,
      assignedProjects: 0,
      pendingProjects: 0,
      fulfillmentRate: 0
    },
    ratingTiers: []
  });

  const [hoveredDept, setHoveredDept] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboardStats();
      if (response && response.data) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.log("Error loading dashboard stats:", error);
    }
  };

  const ratingPercent = Math.min(
    100,
    Math.round(((dashboard.averageRating || 0) / 5) * 100)
  );

  // =========================================================
  // CHART 1: DONUT RING (DEPARTMENT WORKFORCE SHARE)
  // =========================================================
  const deptList = dashboard.departmentDistribution || [];
  const donutRadius = 58;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~364.42
  let accumulatedPercent = 0;

  // =========================================================
  // CHART 2: SEMI-CIRCULAR RADIAL GAUGE (PROJECT STAFFING HEALTH)
  // =========================================================
  const health = dashboard.projectHealth || {
    totalProjects: 0,
    assignedProjects: 0,
    pendingProjects: 0,
    fulfillmentRate: 0
  };

  const gaugeR = 90;
  const gaugeCircumference = Math.PI * gaugeR; // ~282.74
  const fulfillmentPct = Math.min(
    100,
    Math.max(0, health.fulfillmentRate || 0)
  );
  const gaugeOffset =
    gaugeCircumference - (fulfillmentPct / 100) * gaugeCircumference;

  // =========================================================
  // CHART 4: PERFORMANCE RATING PYRAMID / FUNNEL
  // =========================================================
  const ratingTiers = dashboard.ratingTiers || [];

  return (
    <Layout>
      <div className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Super Admin Dashboard</h1>
            <p>
              Welcome back, Executive 👋 &bull; System-wide analytics &amp;
              workforce intelligence
            </p>
          </div>
          <div className="header-badge">
            <span className="status-dot"></span>
            <span>Enterprise View &bull; Live Intelligence</span>
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
              <p>Total Workforce</p>
            </div>
            <span className="trend-badge">
              <FaArrowUp /> Active
            </span>
          </div>

          {/* TOTAL DEPARTMENTS */}
          <div className="card">
            <div className="icon green">
              <FaBuilding />
            </div>
            <div className="card-info">
              <h2>{dashboard.totalDepartments}</h2>
              <p>Active Departments</p>
            </div>
            <span className="trend-badge">Tracked</span>
          </div>

          {/* AVERAGE SALARY */}
          <div className="card">
            <div className="icon orange">
              <FaMoneyBillWave />
            </div>
            <div className="card-info">
              <h2>
                ₹{" "}
                {Number(dashboard.averageSalary || 0).toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0
                  }
                )}
              </h2>
              <p>Company-wide Average</p>
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
              <p>Overall Rating Score</p>
            </div>
            <span className="trend-badge">{ratingPercent}%</span>
          </div>
        </div>

        {/* 3 DISTINCT CHARTS GRID */}
        <div className="charts-grid-3col">
          {/* CHART 1: DONUT RING (DEPARTMENT SHARE) */}
          <div className="chart-box">
            <div className="chart-box-header">
              <div>
                <h3>
                  <FaChartPie className="chart-header-icon indigo" /> Workforce
                  Department Share
                </h3>
                <p className="chart-subhead">
                  Headcount &amp; percentage distribution by department
                </p>
              </div>
              <span className="chart-pill-badge">
                {deptList.length} Departments
              </span>
            </div>

            <div className="donut-chart-container">
              <div className="donut-svg-wrapper">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  className="donut-svg"
                >
                  <circle
                    cx="90"
                    cy="90"
                    r={donutRadius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="20"
                  />
                  <g transform="rotate(-90 90 90)">
                    {deptList.map((dept, index) => {
                      const strokeDash =
                        (dept.percentage / 100) * donutCircumference;
                      const strokeOffset =
                        -(accumulatedPercent / 100) * donutCircumference;
                      accumulatedPercent += dept.percentage;
                      const color =
                        DEPT_COLORS[index % DEPT_COLORS.length];
                      const isHovered = hoveredDept === index;

                      return (
                        <circle
                          key={dept.name || index}
                          cx="90"
                          cy="90"
                          r={donutRadius}
                          fill="transparent"
                          stroke={color}
                          strokeWidth={isHovered ? 24 : 19}
                          strokeDasharray={`${strokeDash} ${
                            donutCircumference - strokeDash
                          }`}
                          strokeDashoffset={strokeOffset}
                          className="donut-segment"
                          onMouseEnter={() => setHoveredDept(index)}
                          onMouseLeave={() => setHoveredDept(null)}
                          style={{
                            transition:
                              "stroke-width 0.25s ease, opacity 0.25s ease",
                            opacity:
                              hoveredDept !== null && !isHovered ? 0.35 : 1,
                            cursor: "pointer"
                          }}
                        />
                      );
                    })}
                  </g>
                  <text
                    x="90"
                    y="84"
                    textAnchor="middle"
                    className="donut-center-val"
                  >
                    {dashboard.totalEmployees || 0}
                  </text>
                  <text
                    x="90"
                    y="102"
                    textAnchor="middle"
                    className="donut-center-sub"
                  >
                    Total Staff
                  </text>
                </svg>
              </div>

              {/* DONUT LEGEND */}
              <div className="donut-legend">
                {deptList.map((dept, index) => {
                  const color = DEPT_COLORS[index % DEPT_COLORS.length];
                  const isHovered = hoveredDept === index;
                  return (
                    <div
                      key={dept.name || index}
                      className={`legend-item ${isHovered ? "active" : ""}`}
                      onMouseEnter={() => setHoveredDept(index)}
                      onMouseLeave={() => setHoveredDept(null)}
                    >
                      <span
                        className="legend-color-dot"
                        style={{ backgroundColor: color }}
                      ></span>
                      <div className="legend-info">
                        <span className="legend-name">{dept.name}</span>
                        <span className="legend-count">{dept.count} staff</span>
                      </div>
                      <span className="legend-pct-badge">{dept.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CHART 2: SEMI-CIRCULAR RADIAL GAUGE (PROJECT HEALTH) */}
          <div className="chart-box">
            <div className="chart-box-header">
              <div>
                <h3>
                  <FaTasks className="chart-header-icon teal" /> Project
                  Staffing &amp; Fulfillment
                </h3>
                <p className="chart-subhead">
                  Execution status of Super Admin project requests
                </p>
              </div>
              <span className="chart-pill-badge">
                {health.totalProjects} Total Requests
              </span>
            </div>

            <div className="gauge-chart-container">
              <div className="gauge-svg-wrapper">
                <svg
                  width="280"
                  height="150"
                  viewBox="0 0 280 150"
                  className="gauge-svg"
                >
                  <defs>
                    <linearGradient
                      id="gaugeGrad"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* BACKGROUND ARC (180 DEGREES) */}
                  <path
                    d="M 50 130 A 90 90 0 0 1 230 130"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />

                  {/* PROGRESS ARC */}
                  <path
                    d="M 50 130 A 90 90 0 0 1 230 130"
                    fill="none"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={gaugeCircumference}
                    strokeDashoffset={gaugeOffset}
                    className="gauge-progress-arc"
                  />

                  {/* CENTER VALUE */}
                  <text
                    x="140"
                    y="112"
                    textAnchor="middle"
                    className="gauge-center-val"
                  >
                    {fulfillmentPct}%
                  </text>
                  <text
                    x="140"
                    y="128"
                    textAnchor="middle"
                    className="gauge-center-sub"
                  >
                    Staffing Fulfillment
                  </text>
                </svg>
              </div>

              {/* GAUGE DETAIL PILLS */}
              <div className="gauge-details">
                <div className="gauge-stat-pill green">
                  <div className="pill-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="pill-text">
                    <strong>{health.assignedProjects} Assigned</strong>
                    <span>Team In-Place</span>
                  </div>
                </div>

                <div className="gauge-stat-pill amber">
                  <div className="pill-icon">
                    <FaClock />
                  </div>
                  <div className="pill-text">
                    <strong>{health.pendingProjects} Pending</strong>
                    <span>Awaiting Team</span>
                  </div>
                </div>
              </div>

              <p className="gauge-footer-note">
                {health.pendingProjects > 0
                  ? `⚡ ${health.pendingProjects} project request(s) awaiting assignment by Department Admins.`
                  : "🎉 Outstanding! 100% of project requests have been assigned to employee teams."}
              </p>
            </div>
          </div>

          {/* CHART 4: PERFORMANCE RATING PYRAMID / FUNNEL */}
          <div className="chart-box">
            <div className="chart-box-header">
              <div>
                <h3>
                  <FaAward className="chart-header-icon orange" /> Workforce
                  Performance Distribution
                </h3>
                <p className="chart-subhead">
                  Employee evaluation breakdown across 4 rating tiers
                </p>
              </div>
              <span className="chart-pill-badge">
                {dashboard.averageRating ? `${Number(dashboard.averageRating).toFixed(1)} / 5.0 ⭐` : "0.0 ⭐"}
              </span>
            </div>

            <div className="performance-funnel-container">
              <div className="funnel-tiers-list">
                {ratingTiers.map((tier, index) => (
                  <div key={index} className="funnel-tier-item">
                    <div className="tier-header-row">
                      <div className="tier-name-col">
                        <span
                          className="tier-badge-indicator"
                          style={{ backgroundColor: tier.color }}
                        ></span>
                        <span className="tier-title">{tier.tier}</span>
                      </div>
                      <div className="tier-stats-col">
                        <span className="tier-count">
                          {tier.count} {tier.count === 1 ? "staff" : "staff"}
                        </span>
                        <span className="tier-percentage">
                          {tier.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="tier-bar-track">
                      <div
                        className="tier-bar-fill"
                        style={{
                          width: `${tier.percentage}%`,
                          backgroundColor: tier.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="performance-summary-box">
                <div className="summary-metric">
                  <span className="metric-label">High Performers (≥ 3.5 ⭐)</span>
                  <span className="metric-val">
                    {(
                      ((ratingTiers[0]?.count || 0) +
                        (ratingTiers[1]?.count || 0))
                    )}{" "}
                    Employees (
                    {Math.round(
                      (ratingTiers[0]?.percentage || 0) +
                        (ratingTiers[1]?.percentage || 0)
                    )}
                    %)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;