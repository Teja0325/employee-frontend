import { useEffect, useState } from "react";
import { getMyProfile } from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../css/Profile.css";
import { FaShieldAlt, FaKey } from "react-icons/fa";

function Profile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  let permissions = [];
  try {
    permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  } catch (e) {
    permissions = [];
  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response =
          await getMyProfile();

        setProfile(response.data);

      } catch (error) {

        console.log(
          "Unable to load profile:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // =====================================================
  // DISPLAY NAME
  // =====================================================

  const getDisplayName = () => {

    if (
      role === "ADMIN" ||
      role === "SUPER_ADMIN"
    ) {

      return "Administration";

    }

    if (profile) {

      return `${profile.firstName} ${profile.lastName}`;

    }

    return "User";

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <Layout>

        <div className="profile-page">

          <h2>
            Loading profile...
          </h2>

        </div>

      </Layout>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (!profile) {

    return (

      <Layout>

        <div className="profile-page">

          <h2>
            Unable to load profile
          </h2>

        </div>

      </Layout>

    );

  }


  // =====================================================
  // PROFILE
  // =====================================================

  return (

    <Layout>

      <div className="profile-page">


        {/* ==============================================
            HEADER
        ============================================== */}

        <div className="profile-header">

          <div>

            <h1>
              My Profile
            </h1>

            <p>
              View your account information
            </p>

          </div>


          {/* ============================================
              EDIT PROFILE BUTTON
          ============================================ */}

          <button
            type="button"
            className="edit-profile-btn"
            onClick={() =>
              navigate("/edit-my-profile")
            }
          >

            Edit Profile

          </button>

        </div>


        {/* ==============================================
            PROFILE CARD
        ============================================== */}

        <div className="profile-card">


          {/* ============================================
              PROFILE TOP
          ============================================ */}

          <div className="profile-top">


            <div className="profile-avatar">

              {profile.firstName?.charAt(0)}

            </div>


            <div>

              <h2>
                {getDisplayName()}
              </h2>


              <p>
                {profile.email}
              </p>


              <span className="role-badge">

                {profile.role}

              </span>

            </div>

          </div>


          {/* ============================================
              PROFILE DETAILS
          ============================================ */}

          <div className="profile-details">


            <div className="detail-item">

              <label>
                Employee ID
              </label>

              <span>
                {profile.employeeId}
              </span>

            </div>


            <div className="detail-item">

              <label>
                First Name
              </label>

              <span>
                {profile.firstName}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Last Name
              </label>

              <span>
                {profile.lastName}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Email
              </label>

              <span>
                {profile.email}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Phone Number
              </label>

              <span>
                {profile.phoneNumber}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Gender
              </label>

              <span>
                {profile.gender}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Date of Birth
              </label>

              <span>
                {profile.dateOfBirth}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Department
              </label>

              <span>
                {profile.department}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Job Title
              </label>

              <span>
                {profile.jobTitle}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Hire Date
              </label>

              <span>
                {profile.hireDate}
              </span>

            </div>


            <div className="detail-item">

              <label>
                City
              </label>

              <span>
                {profile.city}
              </span>

            </div>


            <div className="detail-item">

              <label>
                State
              </label>

              <span>
                {profile.state}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Country
              </label>

              <span>
                {profile.country}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Education
              </label>

              <span>
                {profile.educationLevel}
              </span>

            </div>


            <div className="detail-item">

              <label>
                Experience
              </label>

              <span>
                {profile.yearsOfExperience} years
              </span>

            </div>


            <div className="detail-item">

              <label>
                Rating
              </label>

              <span>
                ⭐ {profile.rating}
              </span>

            </div>


          </div>


          {/* ============================================
              RBAC: ASSIGNED PERMISSIONS
          ============================================ */}

          <div className="permissions-section">

            <div className="permissions-header">

              <FaShieldAlt className="shield-icon" />

              <div>
                <h3>Assigned Permissions (RBAC)</h3>
                <p>Granular authorities and operation access granted to your role</p>
              </div>

            </div>

            <div className="permissions-list">

              {permissions.length > 0 ? (
                permissions.map((permission, index) => (
                  <span key={index} className="permission-chip">
                    <FaKey className="key-icon" />
                    {permission}
                  </span>
                ))
              ) : (
                <p className="no-permissions">No specific permissions assigned.</p>
              )}

            </div>

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Profile;