import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";

import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import AdminDashboard from "./pages/AdminDashboard";

import EditMyProfile from "./pages/EditMyProfile";
import ChangePassword from "./pages/ChangePassword";

import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";


import Timesheet from "./pages/Timesheet";

import ProjectList from "./pages/ProjectList";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import RolesPermissions from "./pages/RolesPermissions";



import ProtectedRoute from "./components/ProtectedRoute";

import { Toaster } from "sonner";
import "sonner/dist/styles.css";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ==========================================
                    LOGIN
                ========================================== */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* ==========================================
                    SUPER ADMIN + ADMIN DASHBOARD
                ========================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "ADMIN"
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    EMPLOYEE / ADMIN LIST
                    SUPER ADMIN + ADMIN
                ========================================== */}

        <Route
          path="/employees"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "ADMIN"
              ]}
            >
              <EmployeeList />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    ADD EMPLOYEE / ADMIN
                    SUPER ADMIN + ADMIN
                ========================================== */}

        <Route
          path="/add"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "ADMIN"
              ]}
            >
              <AddEmployee />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    EDIT EMPLOYEE / ADMIN
                    SUPER ADMIN + ADMIN
                ========================================== */}

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "ADMIN"
              ]}
            >
              <EditEmployee />
            </ProtectedRoute>
          }
        />



        {/* ==========================================
                    EMPLOYEE DASHBOARD
                ========================================== */}

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE"
              ]}
            >
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    EMPLOYEE PROFILE
                ========================================== */}

        <Route
          path="/employee"
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE"
              ]}
            >
              <EmployeeProfile />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    ADMIN DASHBOARD
                ========================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN"
              ]}
            >
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    EDIT MY PROFILE
                    EMPLOYEE
                ========================================== */}

        <Route
          path="/edit-my-profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE",
                "ADMIN",
                "SUPER_ADMIN"
              ]}
            >
              <EditMyProfile />
            </ProtectedRoute>
          }
        />


        {/* ==========================================
                    MY PROFILE
                    EMPLOYEE + ADMIN + SUPER ADMIN
                ========================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE",
                "ADMIN",
                "SUPER_ADMIN"
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE",
                "ADMIN",
                "SUPER_ADMIN"
              ]}
            >
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timesheet"
          element={
            <ProtectedRoute
              allowedRoles={[
                "EMPLOYEE",
                "ADMIN",
                "SUPER_ADMIN"
              ]}
            >
              <Timesheet />
            </ProtectedRoute>
          }
        />
        <Route path="/projects" element={<ProjectList />} />
        <Route
          path="/projects"
          element={<ProjectList />}
        />

        <Route
          path="/projects/add"
          element={<AddProject />}
        />

        <Route
          path="/projects/edit/:projectId"
          element={<EditProject />}
        />

        <Route
          path="/roles-permissions"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SUPER_ADMIN",
                "ADMIN"
              ]}
            >
              <RolesPermissions />
            </ProtectedRoute>
          }
        />

      </Routes>


      {/* ==========================================
                TOAST
            ========================================== */}

      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />

    </BrowserRouter>
  );
}


export default App;