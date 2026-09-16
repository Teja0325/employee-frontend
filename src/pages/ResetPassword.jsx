import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/ApiService";
import { toast } from "sonner";
import "../css/ForgotPassword.css";

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);


  // =====================================================
  // PASSWORD VALIDATION
  // =====================================================

  const validatePassword = (value) => {

    if (!value) {
      return "Password is required.";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };


  // =====================================================
  // CONFIRM PASSWORD VALIDATION
  // =====================================================

  const validateConfirmPassword = (value) => {

    if (!value) {
      return "Confirm password is required.";
    }

    if (value !== password) {
      return "Passwords do not match.";
    }

    return "";
  };


  // =====================================================
  // PASSWORD CHANGE
  // =====================================================

  const handlePasswordChange = (e) => {

    const value = e.target.value;

    setPassword(value);

    setErrors((previous) => ({
      ...previous,
      password: validatePassword(value),
      confirmPassword: confirmPassword
        ? validateConfirmPassword(confirmPassword)
        : ""
    }));

  };


  // =====================================================
  // CONFIRM PASSWORD CHANGE
  // =====================================================

  const handleConfirmPasswordChange = (e) => {

    const value = e.target.value;

    setConfirmPassword(value);

    setErrors((previous) => ({
      ...previous,
      confirmPassword:
        validateConfirmPassword(value)
    }));

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!email || !otp) {

      toast.error(
        "Reset session expired. Please start again."
      );

      navigate("/forgot-password");

      return;
    }


    const passwordError =
      validatePassword(password);

    const confirmError =
      validateConfirmPassword(confirmPassword);


    const newErrors = {};


    if (passwordError) {

      newErrors.password =
        passwordError;

    }


    if (confirmError) {

      newErrors.confirmPassword =
        confirmError;

    }


    setErrors(newErrors);


    if (Object.keys(newErrors).length > 0) {

      return;

    }


    try {

      setLoading(true);


      await resetPassword(
        email,
        otp,
        password
      );


      toast.success(
        "Password reset successfully"
      );


      setTimeout(() => {

        navigate("/");

      }, 700);


    } catch (error) {

      console.log(
        "Reset password error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
        "Unable to reset password."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="forgot-page">

      <div className="forgot-card">

        <h1>
          Reset Password
        </h1>


        <p className="forgot-subtitle">

          Create a new password for your account.

        </p>


        <form
          onSubmit={handleSubmit}
          noValidate
        >


          {/* NEW PASSWORD */}

          <div className="form-group">

            <label>
              New Password
            </label>


            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={handlePasswordChange}
              className={
                errors.password
                  ? "input-error"
                  : ""
              }
            />


            {errors.password && (

              <span className="error-text">

                {errors.password}

              </span>

            )}

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>


            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={
                handleConfirmPasswordChange
              }
              className={
                errors.confirmPassword
                  ? "input-error"
                  : ""
              }
            />


            {errors.confirmPassword && (

              <span className="error-text">

                {errors.confirmPassword}

              </span>

            )}

          </div>


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Resetting..."
              : "Reset Password"}

          </button>


          <button
            type="button"
            className="back-login-btn"
            onClick={() => navigate("/")}
          >

            Back to Login

          </button>

        </form>

      </div>

    </div>

  );

}

export default ResetPassword;