import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/ApiService";
import "../css/Login.css";
import { toast } from "sonner";
import "sonner/dist/styles.css";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBuilding,
} from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(email, password);

      // Store JWT token
      localStorage.setItem("token", response.data.token);

      // Store role
      localStorage.setItem("role", response.data.role);

      // Store employee ID
      if (response.data.employeeId) {
        localStorage.setItem("employeeId", response.data.employeeId);
      }

      // Store name
      if (response.data.name) {
        localStorage.setItem("name", response.data.name);
      }

      // Store permissions
      localStorage.setItem(
        "permissions",
        JSON.stringify(response.data.permissions || [])
      );

      toast.success("Login Successful");

      // Role based navigation
      setTimeout(() => {
        if (response.data.role === "SUPER_ADMIN") {
          navigate("/dashboard");
        } else if (response.data.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else if (response.data.role === "EMPLOYEE") {
          navigate("/employee-dashboard");
        } else {
          toast.error("Invalid Role");
        }
      }, 400);

    } catch (error) {
      console.log("LOGIN ERROR:", error);
      toast.error("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LOGO & BRAND */}
        <div className="login-logo">
          <div className="logo-circle">
            <FaBuilding />
          </div>
          <h1>Employee Hub</h1>
          <p>Sign in to your workplace portal</p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <div>
            <label>Work Email</label>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label>Password</label>
            <div className="input-box">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* FORGOT PASSWORD LINK */}
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;