import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { changePassword } from "../services/ApiService";
import "../css/ChangePassword.css";

function ChangePassword() {

  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // ---------------------------------------------------
    // NEW PASSWORD LENGTH
    // ---------------------------------------------------

    if (newPassword.length < 6) {

      toast.error(
        "New password must contain at least 6 characters"
      );

      return;
    }


    // ---------------------------------------------------
    // CONFIRM PASSWORD
    // ---------------------------------------------------

    if (newPassword !== confirmPassword) {

      toast.error(
        "New password and confirm password do not match"
      );

      return;
    }


    // ---------------------------------------------------
    // CALL BACKEND
    // ---------------------------------------------------

    try {

      setLoading(true);

      await changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );


      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      toast.success(
        "Password changed successfully"
      );


      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");


      // -------------------------------------------------
      // GO BACK TO PROFILE
      // -------------------------------------------------

      setTimeout(() => {

        navigate("/profile");

      }, 700);


    } catch (error) {

      console.log(
        "Change password error:",
        error
      );


      // -------------------------------------------------
      // BACKEND ERROR MESSAGE
      // -------------------------------------------------

      const message =
        error.response?.data?.message;


      if (message) {

        toast.error(message);

      } else {

        toast.error(
          "Unable to change password"
        );
      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <Layout>

      <div className="change-password-page">

        <div className="change-password-card">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="change-password-header">

            <div className="change-password-icon">

              <FaLock />

            </div>

            <div>

              <h2>
                Change Password
              </h2>

              <p>
                Update your account password
              </p>

            </div>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit}>


            {/* =================================================
                CURRENT PASSWORD
            ================================================= */}

            <div className="password-group">

              <label>
                Current Password
              </label>

              <div className="password-input">

                <FaLock />

                <input
                  type={
                    showCurrent
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                  required
                />

                <span
                  onClick={() =>
                    setShowCurrent(
                      !showCurrent
                    )
                  }
                >

                  {showCurrent
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </span>

              </div>

            </div>


            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <div className="password-group">

              <label>
                New Password
              </label>

              <div className="password-input">

                <FaLock />

                <input
                  type={
                    showNew
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />

                <span
                  onClick={() =>
                    setShowNew(
                      !showNew
                    )
                  }
                >

                  {showNew
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </span>

              </div>

            </div>


            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="password-group">

              <label>
                Confirm New Password
              </label>

              <div className="password-input">

                <FaLock />

                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                />

                <span
                  onClick={() =>
                    setShowConfirm(
                      !showConfirm
                    )
                  }
                >

                  {showConfirm
                    ? <FaEyeSlash />
                    : <FaEye />
                  }

                </span>

              </div>

            </div>


            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="change-password-actions">

              <button
                type="button"
                className="change-password-cancel"
                onClick={() =>
                  navigate("/profile")
                }
                disabled={loading}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="change-password-save"
                disabled={loading}
              >

                {loading
                  ? "Changing..."
                  : "Change Password"
                }

              </button>

            </div>

          </form>

        </div>

      </div>

    </Layout>

  );

}

export default ChangePassword;