import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/ApiService";
import { toast } from "sonner";
import "../css/ForgotPassword.css";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // EMAIL VALIDATION
  // =====================================================

  const validateEmail = (value) => {

    if (!value.trim()) {

      return "Email is required.";

    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value
      )
    ) {

      return "Enter a valid email address.";

    }

    return "";

  };


  // =====================================================
  // HANDLE EMAIL CHANGE
  // =====================================================

  const handleChange = (e) => {

    const value = e.target.value;

    setEmail(value);

    const validationError =
      validateEmail(value);

    setError(validationError);

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    const validationError =
      validateEmail(email);


    setError(validationError);


    if (validationError) {

      return;

    }


    try {

      setLoading(true);


      await forgotPassword(email);


      toast.success(
        "OTP generated successfully"
      );


      // Send email to OTP page

      navigate(
        "/verify-otp",
        {
          state: {
            email: email
          }
        }
      );


    } catch (error) {

      console.log(
        "Forgot password error:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Email not found."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="forgot-page">

      <div className="forgot-card">


        <h1>
          Forgot Password?
        </h1>


        <p className="forgot-subtitle">
          Enter your registered email to
          reset your password.
        </p>


        <form
          onSubmit={handleSubmit}
          noValidate
        >


          <div className="form-group">

            <label>
              Email
            </label>


            <input
              type="email"
              placeholder="Enter your email"
              value={email}
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
              ? "Checking..."
              : "Continue"}

          </button>


          <button
            type="button"
            className="back-login-btn"
            onClick={() =>
              navigate("/")
            }
          >

            Back to Login

          </button>


        </form>

      </div>

    </div>

  );

}

export default ForgotPassword;