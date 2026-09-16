import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getMyProfile } from "../services/ApiService";
import "../css/EmployeeProfile.css";

function EmployeeProfile() {

  const navigate = useNavigate();
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {

      const response = await getMyProfile();
      
      setEmployee(response.data);

    } catch (error) {
      console.log("Error loading employee profile:", error);
    }
  };

  return (
    <Layout>

      <div className="profile-page">

        <div className="profile-card">

          <h2>My Profile</h2>

          <table>

            <tbody>
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/edit-my-profile")}>
                Edit Profile
              </button>

              <tr>
                <td><b>Employee ID</b></td>
                <td>{employee.employeeId || "-"}</td>
              </tr>

              <tr>
                <td><b>Name</b></td>
                <td>
                  {employee.firstName || ""}{" "}
                  {employee.lastName || ""}
                </td>
              </tr>

              <tr>
                <td><b>Email</b></td>
                <td>{employee.email || "-"}</td>
              </tr>

              <tr>
                <td><b>Department</b></td>
                <td>{employee.department || "-"}</td>
              </tr>

              <tr>
                <td><b>Job Title</b></td>
                <td>{employee.jobTitle || "-"}</td>
              </tr>

              <tr>
                <td><b>Salary</b></td>
                <td>
                  ₹ {employee.salary ?? "-"}
                </td>
              </tr>

              <tr>
                <td><b>Experience</b></td>
                <td>
                  {employee.yearsOfExperience ?? "-"} Years
                </td>
              </tr>

              <tr>
                <td><b>Rating</b></td>
                <td>{employee.rating ?? "-"}</td>
              </tr>

              <tr>
                <td><b>Phone</b></td>
                <td>{employee.phoneNumber || "-"}</td>
              </tr>

              <tr>
                <td><b>Gender</b></td>
                <td>{employee.gender || "-"}</td>
              </tr>

              <tr>
                <td><b>Date of Birth</b></td>
                <td>{employee.dateOfBirth || "-"}</td>
              </tr>

              <tr>
                <td><b>Hire Date</b></td>
                <td>{employee.hireDate || "-"}</td>
              </tr>

              <tr>
                <td><b>City</b></td>
                <td>{employee.city || "-"}</td>
              </tr>

              <tr>
                <td><b>State</b></td>
                <td>{employee.state || "-"}</td>
              </tr>

              <tr>
                <td><b>Country</b></td>
                <td>{employee.country || "-"}</td>
              </tr>

              <tr>
                <td><b>Education Level</b></td>
                <td>{employee.educationLevel || "-"}</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

export default EmployeeProfile;