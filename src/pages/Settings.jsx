import { useNavigate } from "react-router-dom";
import { FaUserShield, FaCog } from "react-icons/fa";
import "../css/Settings.css";

function Settings() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account and system settings</p>
        </div>
      </div>

      <div className="settings-container">

        {/* General Settings */}
        <div className="settings-card">

          <div className="settings-icon">
            <FaCog />
          </div>

          <div className="settings-content">
            <h2>General Settings</h2>
            <p>
              Manage your account settings and preferences.
            </p>
          </div>

        </div>


        {/* Admin Management - SUPER ADMIN ONLY */}
        {role === "SUPER_ADMIN" && (
          <div
            className="settings-card clickable"
            onClick={() => navigate("/admins")}
          >

            <div className="settings-icon">
              <FaUserShield />
            </div>

            <div className="settings-content">
              <h2>Admin Management</h2>

              <p>
                Create, view, update and delete administrators.
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admins");
                }}
              >
                Manage Admins
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default Settings;