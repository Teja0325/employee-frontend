import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaUser,
  FaLock,
  FaShieldAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../services/ApiService";
import "../css/Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const role = localStorage.getItem("role");

  let permissions = [];
  try {
    permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  } catch (e) {
    permissions = [];
  }


  // ==========================================
  // LOAD LOGGED-IN USER PROFILE
  // ==========================================

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (!storedName) {
      getMyProfile()
        .then((res) => {
          if (res.data) {
            setProfile(res.data);
            const n = `${res.data.firstName || ""} ${res.data.lastName || ""}`.trim();
            if (n) localStorage.setItem("name", n);
          }
        })
        .catch(() => {});
    }
  }, []);


  // ==========================================
  // PROFILE ICON CLICK
  // ==========================================

  const handleProfileClick = () => {

    setShowMenu((previous) => !previous);

  };


  // ==========================================
  // MY PROFILE
  // ==========================================

  const handleMyProfile = () => {

    setShowMenu(false);

    navigate("/profile");

  };


  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = () => {

    setShowMenu(false);

    navigate("/change-password");

  };


  // ==========================================
  // DISPLAY NAME
  // ==========================================

  const getDisplayName = () => {
    const storedName = localStorage.getItem("name");
    if (storedName && storedName.trim()) {
      return storedName.trim();
    }

    if (profile && profile.firstName) {
      return `${profile.firstName} ${profile.lastName || ""}`.trim();
    }

    if (role === "SUPER_ADMIN") {
      return "Super Administrator";
    }

    if (role === "ADMIN") {
      return "Administrator";
    }

    return "User";
  };


  // ==========================================
  // DISPLAY ROLE
  // ==========================================

  const getRoleName = () => {

    if (role === "SUPER_ADMIN") {

      return "Super Administrator";

    }

    if (role === "ADMIN") {

      return "Administrator";

    }

    if (role === "EMPLOYEE") {

      return "Employee";

    }

    return "";

  };


  // ==========================================
  // ROLE BADGE
  // ==========================================

  const getRoleBadge = () => {

    if (role === "SUPER_ADMIN") {

      return (
        <span className="nav-role-badge badge-super-admin">
          SUPER ADMIN
        </span>
      );

    }

    if (role === "ADMIN") {

      return (
        <span className="nav-role-badge badge-admin">
          ADMIN
        </span>
      );

    }

    if (role === "EMPLOYEE") {

      return (
        <span className="nav-role-badge badge-employee">
          EMPLOYEE
        </span>
      );

    }

    return null;

  };


  return (

    <div className="top-navbar">


      {/* ==========================================
          LEFT SIDE
      ========================================== */}

      <div></div>


      {/* ==========================================
          RIGHT SIDE
      ========================================== */}

      <div className="nav-right">

        <div className="profile-container">


          {/* PROFILE */}

          <div
            className="profile"
            onClick={handleProfileClick}
          >

            <FaUserCircle
              className="profile-icon"
            />


            <div>

              <div className="profile-name-row">

                <h4>
                  {getDisplayName()}
                </h4>

                {getRoleBadge()}

              </div>

              <p>
                {getRoleName()}
              </p>

            </div>

          </div>


          {/* ======================================
              PROFILE DROPDOWN
          ====================================== */}

          {showMenu && (

            <div className="profile-dropdown">

              <div className="dropdown-header">

                <strong>{getRoleName()}</strong>

                {permissions.length > 0 && (

                  <span className="dropdown-perm-count">

                    <FaShieldAlt style={{ marginRight: "4px" }} />

                    {permissions.length} Permissions

                  </span>

                )}

              </div>


              {/* MY PROFILE */}

              <div
                className="dropdown-item"
                onClick={handleMyProfile}
              >

                <FaUser />

                <span>
                  My Profile
                </span>

              </div>


              {/* CHANGE PASSWORD */}

              <div
                className="dropdown-item"
                onClick={handleChangePassword}
              >

                <FaLock />

                <span>
                  Change Password
                </span>

              </div>


            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default Navbar;