import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ======================================================
// JWT INTERCEPTOR
// ======================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.url !== "/auth/login") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ======================================================
// LOGIN
// ======================================================

export const login = (email, password) => {
  return API.post("/auth/login", {
    email,
    password,
  });
};


// ======================================================
// EMPLOYEES + ADMINS
// ======================================================

export const getEmployees = () =>
  API.get("/employees");

export const getEmployee = (id) =>
  API.get(`/employees/${id}`);

export const addEmployee = (employee) =>
  API.post("/employees", employee);

export const updateEmployee = (id, employee) =>
  API.put(`/employees/${id}`, employee);

export const deleteEmployee = (id) =>
  API.delete(`/employees/${id}`);


// ======================================================
// MY PROFILE
// ======================================================

export const getMyProfile = () =>
  API.get("/employees/my-profile");

export const updateMyProfile = (profileData) =>
  API.put(
    "/employees/my-profile",
    profileData
  );


// ======================================================
// FILTER EMPLOYEES / ADMINS
// ======================================================

export const filterEmployees = (filterData) =>
  API.post(
    "/employees/filter",
    filterData
  );


// ======================================================
// SUPER ADMIN DASHBOARD
// ======================================================

export const getDashboardStats = () =>
  API.get("/employees/dashboard");


// ======================================================
// EMPLOYEE DASHBOARD
// ======================================================

export const getEmployeeDashboard = (id) =>
  API.get(
    `/employees/employee-dashboard/${id}`
  );


// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = (email) =>
  API.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

export const verifyOtp = (email, otp) =>
  API.post(
    "/auth/verify-otp",
    {
      email,
      otp,
    }
  );

export const resetPassword = (
  email,
  otp,
  password
) =>
  API.post(
    "/auth/reset-password",
    {
      email,
      otp,
      password,
    }
  );


// ======================================================
// CHANGE PASSWORD
// ======================================================

export const changePassword = (
  currentPassword,
  newPassword,
  confirmPassword
) =>
  API.put(
    "/employees/change-password",
    {
      currentPassword,
      newPassword,
      confirmPassword,
    }
  );


// ======================================================
// TIMESHEETS
// ======================================================

// Employee
export const getEmployeeTimesheets = (employeeId) => {
  return API.get(
    `/timesheets/employee/${employeeId}`
  );
};


// Admin
export const getDepartmentTimesheets = (department) => {
  return API.get(
    `/timesheets/department/${encodeURIComponent(department)}`
  );
};


// Super Admin / All for Logged-In User
export const getTimesheets = () => {
  return API.get("/timesheets");
};

// Submit / Create Timesheet
export const createTimesheet = (timesheet) => {
  return API.post("/timesheets", timesheet);
};

// Approve Timesheet
export const approveTimesheet = (approvalData) => {
  return API.put("/timesheets/approve", approvalData);
};

// Reject Timesheet (Mandatory Rejection Reason)
export const rejectTimesheet = (approvalData) => {
  return API.put("/timesheets/reject", approvalData);
};


// ======================================================
// PROJECTS
// ======================================================

// ------------------------------------------------------
// GET PROJECTS FOR LOGGED-IN USER
// ------------------------------------------------------

export const getProjects = () =>
  API.get("/projects");


// ------------------------------------------------------
// GET PROJECT BY ID
// ------------------------------------------------------

export const getProject = (projectId) =>
  API.get(`/projects/${projectId}`);


// ------------------------------------------------------
// GET PROJECTS BY DEPARTMENT
// ------------------------------------------------------

export const getProjectsByDepartment = (department) =>
  API.get(
    `/projects/department/${encodeURIComponent(department)}`
  );


// ------------------------------------------------------
// GET PROJECTS BY EMPLOYEE
// ------------------------------------------------------

export const getProjectsByEmployee = (employeeId) =>
  API.get(
    `/projects/employee/${employeeId}`
  );


// ------------------------------------------------------
// GET PROJECTS BY EMPLOYEE STATUS
// ------------------------------------------------------

export const getProjectsByEmployeeStatus = (
  employeeStatus
) =>
  API.get(
    `/projects/employee-status/${encodeURIComponent(employeeStatus)}`
  );


// ------------------------------------------------------
// GET PROJECTS BY PROJECT STATUS
// ------------------------------------------------------

export const getProjectsByProjectStatus = (
  projectStatus
) =>
  API.get(
    `/projects/project-status/${encodeURIComponent(projectStatus)}`
  );


// ------------------------------------------------------
// ADD PROJECT
// ------------------------------------------------------

export const addProject = (project) =>
  API.post(
    "/projects",
    project
  );


// ------------------------------------------------------
// UPDATE PROJECT
// ------------------------------------------------------

export const updateProject = (
  projectId,
  project
) =>
  API.put(
    `/projects/${projectId}`,
    project
  );


// ------------------------------------------------------
// DELETE PROJECT
// ------------------------------------------------------

export const deleteProject = (projectId) =>
  API.delete(
    `/projects/${projectId}`
  );


// ------------------------------------------------------
// ASSIGN EMPLOYEES TO PROJECT
// ------------------------------------------------------

export const assignProjectEmployees = (projectId, employeeIds) =>
  API.post(
    `/projects/${projectId}/assign`,
    {
      employeeIds,
    }
  );


// ------------------------------------------------------
// GET PROJECT ASSIGNMENTS
// ------------------------------------------------------

export const getProjectAssignments = (projectId) =>
  API.get(
    `/projects/${projectId}/assignments`
  );


// ======================================================
// ADMIN DASHBOARD
// ======================================================

export const getAdminDashboard = () => {
  return API.get(
    "/employees/admin-dashboard"
  );
};


// ======================================================
// ROLES & PERMISSIONS (RBAC)
// ======================================================

export const getRolePermissions = () => {
  return API.get("/roles/permissions");
};

export const updateRolePermissions = (role, permissions) => {
  return API.put(`/roles/${encodeURIComponent(role)}/permissions`, {
    permissions,
  });
};

export const resetRolePermissions = () => {
  return API.post("/roles/reset-defaults");
};

export const getMyPermissions = () => {
  return API.get("/roles/my-permissions");
};


// ======================================================
// EXPORT API
// ======================================================

export default API;