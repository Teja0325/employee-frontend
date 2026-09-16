import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/ApiService";
import { toast } from "sonner";
import "../css/ForgotPassword.css";

function VerifyOtp() {

  const navigate = useNavigate();

  const location = useLocation();

  const email =
    location.state?.email || "";


  const [otp, setOtp] =
    useState("123456");


  const [error, setError] =
    useState("");


  const [loading, setLoading] =
    useState(false);


  // =====================================================
  // OTP VALIDATION
  // =====================================================

  const validateOtp = (value) => {

    if (!value.trim()) {

      return "OTP is required.";

    }

    if (!/^\d{6}$/.test(value)) {

      return "OTP must contain exactly 6 digits.";

    }

    return "";

  };


  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleChange = (e) => {

    const value =
      e.target.value.replace(
        /\D/g,
        ""
      );


    setOtp(value);


    setError(
      validateOtp(value)
    );

  };


  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!email) {

      toast.error(
        "Please start again."
      );

      navigate(
        "/forgot-password"
      );

      return;

    }


    const validationError =
      validateOtp(otp);


    setError(validationError);


    if (validationError) {

      return;

    }


    try {

      setLoading(true);


      await verifyOtp(
        email,
        otp
      );


      toast.success(
        "OTP verified successfully"
      );


      navigate(
        "/reset-password",
        {
          state: {
            email: email,
            otp: otp
          }
        }
      );


    } catch (error) {

      console.log(
        "OTP verification error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Invalid OTP."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="forgot-page">

      <div className="forgot-card">


        <h1>
          Verify OTP
        </h1>


        <p className="forgot-subtitle">

          Enter the OTP to continue.

        </p>


        <form
          onSubmit={handleSubmit}
          noValidate
        >


          <div className="form-group">

            <label>
              OTP
            </label>


            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={handleChange}
              className={
                error
                  ? "input-error"
                  : ""
              }
            />


            {error && (

              <span className="error-text">

                {error}

              </span>

            )}

          </div>


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Verifying..."
              : "Verify OTP"}

          </button>


          <button
            type="button"
            className="back-login-btn"
            onClick={() =>
              navigate(
                "/forgot-password"
              )
            }
          >

            Back

          </button>


        </form>

      </div>

    </div>

  );

}

export default VerifyOtp;