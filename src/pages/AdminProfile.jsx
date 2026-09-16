import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getEmployee } from "../services/ApiService";
import "../css/AdminProfile.css";

function AdminProfile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const employeeId = localStorage.getItem("employeeId");

      if (!employeeId) {
        console.log("Admin employee ID not found");
        return;
      }

      console.log("Getting admin profile with ID:", employeeId);

      const response = await getEmployee(employeeId);

      setProfile(response.data);
    } catch (error) {
      console.error("Error loading admin profile:", error);
    }
  };

  return (
    <Layout>
      <div className="admin-profile-page">

        <div className="admin-profile-card">

          {/* HEADER */}
          <div className="admin-profile-header">

            <div className="admin-profile-avatar">
              {profile.firstName
                ? profile.firstName.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <h1>My Profile</h1>
              <p>Administrator</p>
            </div>

          </div>

          {/* PERSONAL INFORMATION */}
          <div className="admin-profile-section">

            <h2>Personal Information</h2>

            <div className="admin-profile-grid">

              <div className="admin-profile-field">
                <label>Employee ID</label>
                <span>
                  {profile.employeeId || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Role</label>
                <span className="admin-role">
                  ADMIN
                </span>
              </div>

              <div className="admin-profile-field">
                <label>First Name</label>
                <span>
                  {profile.firstName || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Last Name</label>
                <span>
                  {profile.lastName || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Email</label>
                <span>
                  {profile.email || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Phone Number</label>
                <span>
                  {profile.phoneNumber || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Gender</label>
                <span>
                  {profile.gender || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Date of Birth</label>
                <span>
                  {profile.dateOfBirth || "-"}
                </span>
              </div>

            </div>

          </div>

          {/* WORK INFORMATION */}
          <div className="admin-profile-section">

            <h2>Work Information</h2>

            <div className="admin-profile-grid">

              <div className="admin-profile-field">
                <label>Department</label>
                <span>
                  {profile.department || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Job Title</label>
                <span>
                  {profile.jobTitle || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Salary</label>
                <span>
                  {profile.salary
                    ? `₹ ${profile.salary}`
                    : "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Hire Date</label>
                <span>
                  {profile.hireDate || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Years of Experience</label>
                <span>
                  {profile.yearsOfExperience !== null &&
                  profile.yearsOfExperience !== undefined
                    ? `${profile.yearsOfExperience} Years`
                    : "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Rating</label>
                <span>
                  {profile.rating || "-"}
                </span>
              </div>

            </div>

          </div>

          {/* LOCATION & EDUCATION */}
          <div className="admin-profile-section">

            <h2>Additional Information</h2>

            <div className="admin-profile-grid">

              <div className="admin-profile-field">
                <label>City</label>
                <span>
                  {profile.city || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>State</label>
                <span>
                  {profile.state || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Country</label>
                <span>
                  {profile.country || "-"}
                </span>
              </div>

              <div className="admin-profile-field">
                <label>Education Level</label>
                <span>
                  {profile.educationLevel || "-"}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default AdminProfile;