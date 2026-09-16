import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getEmployee } from "../services/ApiService";
import "../css/SuperAdminProfile.css";

function SuperAdminProfile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const id = localStorage.getItem("employeeId");

      if (!id) {
        console.log("Employee ID not found");
        return;
      }

      const response = await getEmployee(id);

      setProfile(response.data);
    } catch (error) {
      console.log("Error loading Super Admin profile:", error);
    }
  };

  return (
    <Layout>
      <div className="super-admin-profile-page">

        <div className="super-admin-profile-card">

          <div className="super-admin-profile-header">
            <div className="super-admin-avatar">
              {profile.firstName
                ? profile.firstName.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div>
              <h1>My Profile</h1>
              <p>Super Administrator</p>
            </div>
          </div>

          <div className="profile-section">

            <h2>Personal Information</h2>

            <div className="profile-grid">

              <div className="profile-field">
                <label>Employee ID</label>
                <span>{profile.employeeId || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Role</label>
                <span className="role-badge">
                  SUPER ADMIN
                </span>
              </div>

              <div className="profile-field">
                <label>First Name</label>
                <span>{profile.firstName || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Last Name</label>
                <span>{profile.lastName || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <span>{profile.email || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <span>{profile.phoneNumber || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Gender</label>
                <span>{profile.gender || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Date of Birth</label>
                <span>{profile.dateOfBirth || "-"}</span>
              </div>

            </div>
          </div>

          <div className="profile-section">

            <h2>Work Information</h2>

            <div className="profile-grid">

              <div className="profile-field">
                <label>Department</label>
                <span>{profile.department || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Job Title</label>
                <span>{profile.jobTitle || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Hire Date</label>
                <span>{profile.hireDate || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Years of Experience</label>
                <span>
                  {profile.yearsOfExperience
                    ? `${profile.yearsOfExperience} Years`
                    : "-"}
                </span>
              </div>

            </div>
          </div>

          <div className="profile-section">

            <h2>Location Information</h2>

            <div className="profile-grid">

              <div className="profile-field">
                <label>City</label>
                <span>{profile.city || "-"}</span>
              </div>

              <div className="profile-field">
                <label>State</label>
                <span>{profile.state || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Country</label>
                <span>{profile.country || "-"}</span>
              </div>

              <div className="profile-field">
                <label>Education Level</label>
                <span>{profile.educationLevel || "-"}</span>
              </div>

            </div>
          </div>

          <div className="profile-actions">
            <button
              className="edit-profile-btn"
              onClick={() =>
                console.log("Edit Super Admin Profile")
              }
            >
              Edit Profile
            </button>
          </div>

        </div>

      </div>
    </Layout>
  );
}

export default SuperAdminProfile;