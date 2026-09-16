import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaBuilding,
  FaClock,
  FaProjectDiagram,
  FaShieldAlt
} from "react-icons/fa";

import { toast } from "sonner";

import "../css/Sidebar.css";

function Sidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const [permissions, setPermissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setPermissions(JSON.parse(localStorage.getItem("permissions") || "[]"));
      } catch {
        setPermissions([]);
      }
    };
    window.addEventListener("permissionsUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("permissionsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const hasPerm = (perm) => permissions.includes(perm);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("permissions");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 500);
  };


  return (

    <div className="sidebar">

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="logo">
        <div className="logo-circle">
          <FaBuilding />
        </div>
        <div className="logo-text">
          <h2>EMS</h2>
          <p>Employee Hub</p>
        </div>
      </div>


      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <ul>

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        <li
          className={
            location.pathname === "/dashboard" ||
            location.pathname === "/employee-dashboard" ||
            location.pathname === "/admin-dashboard"
              ? "active"
              : ""
          }
        >

          <Link
            to={
              role === "EMPLOYEE"
                ? "/employee-dashboard"
                : role === "ADMIN"
                  ? "/admin-dashboard"
                  : "/dashboard"
            }
          >

            <FaHome />

            <span>Dashboard</span>

          </Link>

        </li>


        {/* ==================================================
            EMPLOYEES
            Driven by 'employee:read' permission
        ================================================== */}

        {hasPerm("employee:read") && (

          <li
            className={
              location.pathname === "/employees"
                ? "active"
                : ""
            }
          >

            <Link to="/employees">

              <FaUsers />

              <span>Employees</span>

            </Link>

          </li>

        )}



        {/* ==================================================
            TIMESHEET
            Driven by 'timesheet:read' or 'timesheet:create'
        ================================================== */}

        {(hasPerm("timesheet:read") || hasPerm("timesheet:create")) && (

          <li
            className={
              location.pathname === "/timesheet"
                ? "active"
                : ""
            }
          >

            <Link to="/timesheet">

              <FaClock />

              <span>
                {role === "SUPER_ADMIN"
                  ? "Timesheets"
                  : role === "ADMIN"
                    ? "Department Timesheet"
                    : "My Timesheet"}
              </span>

            </Link>

          </li>

        )}


        {/* ==================================================
            PROJECTS
            Driven by 'project:read' permission
        ================================================== */}

        {hasPerm("project:read") && (

          <li
            className={
              location.pathname === "/projects"
                ? "active"
                : ""
            }
          >

            <Link to="/projects">

              <FaProjectDiagram />

              <span>
                {role === "SUPER_ADMIN"
                  ? "Projects"
                  : role === "ADMIN"
                    ? "Department Projects"
                    : "My Projects"}
              </span>

            </Link>

          </li>

        )}


        {/* ==================================================
            ROLES & PERMISSIONS
            SUPER ADMIN + ADMIN
        ================================================== */}

        {(role === "SUPER_ADMIN" || role === "ADMIN" || hasPerm("admin:access")) && (

          <li
            className={
              location.pathname === "/roles-permissions"
                ? "active"
                : ""
            }
          >

            <Link to="/roles-permissions">

              <FaShieldAlt />

              <span>Roles & Permissions</span>

            </Link>

          </li>

        )}

      </ul>


      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div
        className="logout"
        onClick={handleLogout}
      >

        <FaSignOutAlt />

        <span>Logout</span>

      </div>

    </div>

  );
}

export default Sidebar;