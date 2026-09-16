import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import "../css/EmployeeDashboard.css";

import { getEmployeeDashboard } from "../services/ApiService";

import {
  FaCalendarAlt,
  FaEnvelope,
  FaBullhorn,
  FaTasks
} from "react-icons/fa";


function EmployeeDashboard() {

  const [employee, setEmployee] = useState({});


  // ==========================================
  // LOAD EMPLOYEE DASHBOARD
  // ==========================================

  useEffect(() => {

    loadDashboard();

  }, []);


  const loadDashboard = async () => {

    try {

      const id = localStorage.getItem("employeeId");

      if (!id) {

        console.log(
          "Employee ID not found in localStorage"
        );

        return;

      }


      const response =
        await getEmployeeDashboard(id);


      setEmployee(response.data);

    } catch (error) {

      console.log(
        "Error loading employee dashboard:",
        error
      );

    }

  };


  return (

    <Layout>

      <div className="employee-dashboard">


        {/* ==========================================
            WELCOME
        ========================================== */}

        <div className="welcome-card">

          <h1>
            Welcome, {employee.fullName || "Employee"} 👋
          </h1>


          <p>

            {employee.jobTitle || "Employee"}

            {employee.department
              ? ` | ${employee.department} Department`
              : ""}

          </p>

        </div>


        {/* ==========================================
            DASHBOARD GRID
        ========================================== */}

        <div className="dashboard-grid">


          {/* ==========================================
              TODAY'S MEETINGS
          ========================================== */}

          <div className="dashboard-card">

            <h2>

              <FaCalendarAlt />

              Today's Meetings

            </h2>


            <div className="card-item">

              <strong>
                10:00 AM
              </strong>

              <p>
                Daily Team Stand-up
              </p>

            </div>


            <div className="card-item">

              <strong>
                02:00 PM
              </strong>

              <p>
                Client Discussion
              </p>

            </div>


            <div className="card-item">

              <strong>
                04:30 PM
              </strong>

              <p>
                Sprint Review
              </p>

            </div>

          </div>


          {/* ==========================================
              RECENT MAILS
          ========================================== */}

          <div className="dashboard-card">

            <h2>

              <FaEnvelope />

              Recent Mails

            </h2>


            <div className="card-item">

              <p>
                HR Policy Update
              </p>

            </div>


            <div className="card-item">

              <p>
                Salary Slip Available
              </p>

            </div>


            <div className="card-item">

              <p>
                Meeting Invitation
              </p>

            </div>

          </div>


          {/* ==========================================
              COMPANY ANNOUNCEMENTS
          ========================================== */}

          <div className="dashboard-card">

            <h2>

              <FaBullhorn />

              Company Announcements

            </h2>


            <div className="card-item">

              <p>
                Friday Work From Home
              </p>

            </div>


            <div className="card-item">

              <p>
                Holiday Calendar Released
              </p>

            </div>


            <div className="card-item">

              <p>
                Security Awareness Training
              </p>

            </div>

          </div>


          {/* ==========================================
              TODAY'S TASKS
          ========================================== */}

          <div className="dashboard-card">

            <h2>

              <FaTasks />

              Today's Tasks

            </h2>


            <div className="card-item">

              <p>
                ✅ Submit Timesheet
              </p>

            </div>


            <div className="card-item">

              <p>
                ✅ Complete Assigned Task
              </p>

            </div>

          </div>


        </div>

      </div>

    </Layout>

  );

}


export default EmployeeDashboard;