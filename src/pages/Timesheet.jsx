import { useEffect, useState, useMemo } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaProjectDiagram,
  FaCheckCircle,
  FaTimesCircle,
  FaPlus,
  FaHourglassHalf,
  FaBuilding,
  FaSearch,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";
import Layout from "../components/Layout";
import {
  getTimesheets,
  getDepartmentTimesheets,
  getEmployeeTimesheets,
  createTimesheet,
  approveTimesheet,
  rejectTimesheet,
  getProjects,
  getProjectsByDepartment,
  getProjectsByEmployee,
  getMyProfile,
} from "../services/ApiService";
import { toast } from "sonner";
import "../css/Timesheet.css";

function Timesheet() {
  const [timesheets, setTimesheets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);

  // Modal States
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  // New Timesheet Form
  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    date: new Date().toISOString().split("T")[0],
    checkIn: "09:00",
    checkOut: "17:00",
  });

  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const isEmployee = role === "EMPLOYEE";

  // ======================================================
  // LOAD DATA USING ROLE-SPECIFIC APIs
  // ======================================================
  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch user profile first to determine role, department, and employeeId
      let profile = userProfile;
      if (!profile) {
        try {
          const profRes = await getMyProfile();
          profile = profRes.data;
          setUserProfile(profile);
        } catch (e) {
          console.warn("Could not fetch user profile", e);
        }
      }

      const userRole = (role || profile?.role || "").toUpperCase();
      const userDept = profile?.department;
      const empId = profile?.employeeId || localStorage.getItem("employeeId");

      // 2. Call role-specific Timesheet API:
      // - Super Admin calls getTimesheets() (/api/timesheets)
      // - Admin calls getDepartmentTimesheets(dept) (/api/timesheets/department/{dept})
      // - Employee calls getEmployeeTimesheets(empId) (/api/timesheets/employee/{id})
      let timesheetPromise;
      if (userRole === "SUPER_ADMIN") {
        timesheetPromise = getTimesheets();
      } else if (userRole === "ADMIN" && userDept) {
        timesheetPromise = getDepartmentTimesheets(userDept);
      } else if (empId) {
        timesheetPromise = getEmployeeTimesheets(empId);
      } else {
        timesheetPromise = getTimesheets();
      }

      // 3. Call role-specific Project API:
      // - Super Admin calls getProjects() (/api/projects)
      // - Admin calls getProjectsByDepartment(dept) (/api/projects/department/{dept})
      // - Employee calls getProjectsByEmployee(empId) (/api/projects/employee/{id})
      let projectPromise;
      if (userRole === "SUPER_ADMIN") {
        projectPromise = getProjects();
      } else if (userRole === "ADMIN" && userDept) {
        projectPromise = getProjectsByDepartment(userDept);
      } else if (empId) {
        projectPromise = getProjectsByEmployee(empId);
      } else {
        projectPromise = getProjects();
      }

      const [timesheetsRes, projectsRes] = await Promise.allSettled([
        timesheetPromise,
        projectPromise,
      ]);

      if (timesheetsRes.status === "fulfilled") {
        const data = Array.isArray(timesheetsRes.value.data)
          ? timesheetsRes.value.data
          : [];
        setTimesheets(data.filter((item) => item !== null && item !== undefined));
      } else {
        console.error("Timesheets error:", timesheetsRes.reason);
        setError(
          timesheetsRes.reason?.response?.data?.message ||
            "Unable to load timesheets."
        );
      }

      if (projectsRes.status === "fulfilled") {
        const pData = Array.isArray(projectsRes.value.data)
          ? projectsRes.value.data
          : [];
        setProjects(pData);
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setError("An unexpected error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  const reloadTimesheetsOnly = async () => {
    try {
      const userRole = (role || userProfile?.role || "").toUpperCase();
      const userDept = userProfile?.department;
      const empId = userProfile?.employeeId || localStorage.getItem("employeeId");

      let timesheetPromise;
      if (userRole === "SUPER_ADMIN") {
        timesheetPromise = getTimesheets();
      } else if (userRole === "ADMIN" && userDept) {
        timesheetPromise = getDepartmentTimesheets(userDept);
      } else if (empId) {
        timesheetPromise = getEmployeeTimesheets(empId);
      } else {
        timesheetPromise = getTimesheets();
      }

      const response = await timesheetPromise;
      const data = Array.isArray(response.data) ? response.data : [];
      setTimesheets(data.filter((item) => item !== null && item !== undefined));
    } catch (err) {
      console.error("Error refreshing timesheets:", err);
    }
  };

  // ======================================================
  // HELPERS: DURATION & CALCULATIONS
  // ======================================================
  const calculateDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;
    const [inH, inM] = inTime.split(":").map(Number);
    const [outH, outM] = outTime.split(":").map(Number);
    let totalMin = outH * 60 + outM - (inH * 60 + inM);
    if (totalMin < 0) totalMin += 24 * 60; // overnight shift
    return Math.round((totalMin / 60) * 100) / 100;
  };

  const previewHours = useMemo(() => {
    return calculateDuration(formData.checkIn, formData.checkOut);
  }, [formData.checkIn, formData.checkOut]);

  // Hourly rate estimation from profile salary (salary / 160)
  const estimatedHourlyRate = useMemo(() => {
    if (userProfile && userProfile.salary && Number(userProfile.salary) > 0) {
      return Number(userProfile.salary) / 160;
    }
    return 0;
  }, [userProfile]);

  const estimatedPay = useMemo(() => {
    return (previewHours * estimatedHourlyRate).toFixed(2);
  }, [previewHours, estimatedHourlyRate]);

  // Unique departments for Super Admin filter
  const departmentsList = useMemo(() => {
    const deps = new Set();
    timesheets.forEach((item) => {
      if (item.department) deps.add(item.department);
    });
    return Array.from(deps);
  }, [timesheets]);

  // ======================================================
  // FILTERED TIMESHEETS
  // ======================================================
  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((item) => {
      // Status filter
      if (statusFilter !== "ALL") {
        const itemStatus = (item.status || "PENDING").toUpperCase();
        if (itemStatus !== statusFilter) return false;
      }

      // Department filter (for Super Admin)
      if (departmentFilter !== "ALL") {
        if (
          !item.department ||
          item.department.toLowerCase() !== departmentFilter.toLowerCase()
        ) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const empMatch = item.employeeName?.toLowerCase().includes(q);
        const projMatch = item.projectName?.toLowerCase().includes(q);
        const deptMatch = item.department?.toLowerCase().includes(q);
        const dateMatch = item.date?.toLowerCase().includes(q);
        const empIdMatch = String(item.employeeId || "").includes(q);
        if (!empMatch && !projMatch && !deptMatch && !dateMatch && !empIdMatch) {
          return false;
        }
      }

      return true;
    });
  }, [timesheets, statusFilter, departmentFilter, searchQuery]);

  // ======================================================
  // KPI METRICS
  // ======================================================
  const metrics = useMemo(() => {
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let totalApprovedHours = 0;
    let totalApprovedPay = 0;

    timesheets.forEach((item) => {
      const st = (item.status || "PENDING").toUpperCase();
      if (st === "PENDING") pendingCount++;
      else if (st === "APPROVED") {
        approvedCount++;
        totalApprovedHours += Number(item.totalHours) || 0;
        totalApprovedPay += Number(item.totalPay) || 0;
      } else if (st === "REJECTED") {
        rejectedCount++;
      }
    });

    return {
      total: timesheets.length,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalApprovedHours: Math.round(totalApprovedHours * 100) / 100,
      totalApprovedPay: Math.round(totalApprovedPay * 100) / 100,
    };
  }, [timesheets]);

  // ======================================================
  // ACTIONS: CREATE TIMESHEET
  // ======================================================
  const handleOpenLogModal = () => {
    if (projects.length > 0) {
      setFormData({
        projectId: projects[0].projectId || "",
        projectName: projects[0].projectName || "",
        date: new Date().toISOString().split("T")[0],
        checkIn: "09:00",
        checkOut: "17:00",
      });
    } else {
      setFormData({
        projectId: "",
        projectName: "",
        date: new Date().toISOString().split("T")[0],
        checkIn: "09:00",
        checkOut: "17:00",
      });
    }
    setLogModalOpen(true);
  };

  const handleProjectSelectChange = (e) => {
    const selectedId = e.target.value;
    const proj = projects.find(
      (p) => String(p.projectId) === String(selectedId)
    );
    setFormData((prev) => ({
      ...prev,
      projectId: selectedId,
      projectName: proj ? proj.projectName : "",
    }));
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectId) {
      toast.error("Please select a project.");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date.");
      return;
    }
    if (!formData.checkIn || !formData.checkOut) {
      toast.error("Check-in and Check-out times are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        projectId: Number(formData.projectId),
        projectName: formData.projectName,
        date: formData.date,
        checkIn: formData.checkIn + ":00",
        checkOut: formData.checkOut + ":00",
        employeeId: userProfile?.employeeId,
      };

      await createTimesheet(payload);
      toast.success(
        isAdmin
          ? "Timesheet submitted for Super Admin review!"
          : "Timesheet submitted for Department Admin approval!"
      );
      setLogModalOpen(false);
      await reloadTimesheetsOnly();
    } catch (err) {
      console.error("Submit timesheet error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to submit timesheet. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // ACTIONS: APPROVE TIMESHEET
  // ======================================================
  const handleApprove = async (item) => {
    try {
      setActionLoading(true);
      const payload = {
        projectId: item.projectId,
        employeeId: item.employeeId,
        date: item.date,
      };

      await approveTimesheet(payload);
      toast.success(
        `Timesheet for ${item.employeeName || "Employee"} approved!`
      );
      await reloadTimesheetsOnly();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error(
        err.response?.data?.message || "Failed to approve timesheet."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // ACTIONS: REJECT TIMESHEET (MANDATORY REASON)
  // ======================================================
  const handleOpenRejectModal = (item) => {
    setSelectedTimesheet(item);
    setRejectionReasonInput("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();

    if (!rejectionReasonInput || !rejectionReasonInput.trim()) {
      toast.error("A rejection reason is mandatory before rejecting.");
      return;
    }

    try {
      setActionLoading(true);
      const payload = {
        projectId: selectedTimesheet.projectId,
        employeeId: selectedTimesheet.employeeId,
        date: selectedTimesheet.date,
        rejectionReason: rejectionReasonInput.trim(),
      };

      await rejectTimesheet(payload);
      toast.success(
        `Timesheet rejected. Reason communicated to ${selectedTimesheet.employeeName}.`
      );
      setRejectModalOpen(false);
      setSelectedTimesheet(null);
      await reloadTimesheetsOnly();
    } catch (err) {
      console.error("Reject error:", err);
      toast.error(
        err.response?.data?.message || "Failed to reject timesheet."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ======================================================
  // ACTIONS: VIEW REJECTION REASON
  // ======================================================
  const handleViewReason = (item) => {
    setSelectedTimesheet(item);
    setReasonModalOpen(true);
  };

  // ======================================================
  // FORMATTERS
  // ======================================================
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return time.toString().substring(0, 5);
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "$0.00";
    return `$${Number(val).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const val = (status || "PENDING").toUpperCase();
    if (val === "APPROVED") {
      return (
        <span className="ts-badge ts-badge-success">
          <FaCheckCircle /> Approved
        </span>
      );
    }
    if (val === "REJECTED") {
      return (
        <span className="ts-badge ts-badge-danger">
          <FaTimesCircle /> Rejected
        </span>
      );
    }
    return (
      <span className="ts-badge ts-badge-warning">
        <FaHourglassHalf /> Pending Approval
      </span>
    );
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <Layout>
      <div className="timesheet-page">
        {/* ==================================================
            HEADER SECTION
        ================================================== */}
        <div className="timesheet-header-container">
          <div className="timesheet-title-group">
            <h1>
              Timesheet & Work Hours
              {isSuperAdmin && (
                <span className="ts-superadmin-tag">
                  <FaShieldAlt /> Super Admin Master View
                </span>
              )}
            </h1>

          </div>

          <div className="timesheet-actions-group">
            {/* Log Timesheet Button (Available to Employee & Admin) */}
            {(isEmployee || isAdmin) && (
              <button
                onClick={handleOpenLogModal}
                className="ts-btn ts-btn-primary"
              >
                <FaPlus /> Log Timesheet
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            KPI METRIC CARDS
        ================================================== */}
        <div className="ts-kpi-grid">
          <div className="ts-kpi-card">
            <div className="ts-kpi-icon icon-blue">
              <FaClock />
            </div>
            <div className="ts-kpi-details">
              <span className="ts-kpi-label">Total Logged Entries</span>
              <span className="ts-kpi-value">{metrics.total}</span>
            </div>
          </div>

          <div className="ts-kpi-card">
            <div className="ts-kpi-icon icon-amber">
              <FaHourglassHalf />
            </div>
            <div className="ts-kpi-details">
              <span className="ts-kpi-label">Pending Approvals</span>
              <span className="ts-kpi-value">{metrics.pendingCount}</span>
            </div>
          </div>

          <div className="ts-kpi-card">
            <div className="ts-kpi-icon icon-green">
              <FaCheckCircle />
            </div>
            <div className="ts-kpi-details">
              <span className="ts-kpi-label">Approved Work Hours</span>
              <span className="ts-kpi-value">{metrics.totalApprovedHours} hrs</span>
            </div>
          </div>

          <div className="ts-kpi-card">
            <div className="ts-kpi-icon icon-emerald">
              <FaMoneyBillWave />
            </div>
            <div className="ts-kpi-details">
              <span className="ts-kpi-label">
                {isEmployee ? "My Approved Earnings" : "Total Approved Payout"}
              </span>
              <span className="ts-kpi-value">
                {formatCurrency(metrics.totalApprovedPay)}
              </span>
            </div>
          </div>
        </div>


        {/* ==================================================
            MAIN CARD & FILTER CONTROLS
        ================================================== */}
        <div className="timesheet-card">
          <div className="ts-filter-bar">
            {/* Status Tabs */}
            <div className="ts-tab-group">
              <button
                className={`ts-tab ${statusFilter === "ALL" ? "active" : ""}`}
                onClick={() => setStatusFilter("ALL")}
              >
                All ({timesheets.length})
              </button>
              <button
                className={`ts-tab ${
                  statusFilter === "PENDING" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("PENDING")}
              >
                Pending ({metrics.pendingCount})
              </button>
              <button
                className={`ts-tab ${
                  statusFilter === "APPROVED" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("APPROVED")}
              >
                Approved ({metrics.approvedCount})
              </button>
              <button
                className={`ts-tab ${
                  statusFilter === "REJECTED" ? "active" : ""
                }`}
                onClick={() => setStatusFilter("REJECTED")}
              >
                Rejected ({metrics.rejectedCount})
              </button>
            </div>

            {/* Right Side Filters: Department & Search */}
            <div className="ts-filter-right">
              {isSuperAdmin && departmentsList.length > 0 && (
                <div className="ts-dept-select-wrap">
                  <FaBuilding className="select-icon" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="ts-select"
                  >
                    <option value="ALL">All Departments</option>
                    {departmentsList.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="ts-search-wrap">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search project, employee, date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ts-search-input"
                />
              </div>
            </div>
          </div>

          {/* ==================================================
              LOADING STATE
          ================================================== */}
          {loading && (
            <div className="empty-card">
              <div className="loading-spinner"></div>
              <h3>Loading Timesheet Records...</h3>
              <p>Fetching work logs, hours calculation, and approval states.</p>
            </div>
          )}

          {/* ==================================================
              ERROR STATE
          ================================================== */}
          {!loading && error && (
            <div className="empty-card error-card">
              <FaTimesCircle className="empty-icon text-danger" />
              <h3>Unable to Load Timesheets</h3>
              <p>{error}</p>
              <button onClick={loadInitialData} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {/* ==================================================
              NO RECORDS
          ================================================== */}
          {!loading && !error && filteredTimesheets.length === 0 && (
            <div className="empty-card">
              <FaCalendarAlt className="empty-icon" />
              <h2>No Timesheets Found</h2>
              <p>
                {searchQuery ||
                statusFilter !== "ALL" ||
                departmentFilter !== "ALL"
                  ? "No timesheets match your active filter criteria."
                  : "No timesheet records have been logged yet."}
              </p>
              {(isEmployee || isAdmin) && (
                <button
                  onClick={handleOpenLogModal}
                  className="ts-btn ts-btn-primary"
                  style={{ marginTop: 16 }}
                >
                  <FaPlus /> Log First Timesheet
                </button>
              )}
            </div>
          )}

          {/* ==================================================
              TIMESHEET TABLE
          ================================================== */}
          {!loading && !error && filteredTimesheets.length > 0 && (
            <div className="table-wrapper">
              <table className="timesheet-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Employee / Role</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Work Shift</th>
                    <th>Hours</th>
                    <th>Hourly Rate</th>
                    <th>Calculated Pay</th>
                    <th>Status</th>
                    <th style={{ textAlign: "center" }}>Actions / Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTimesheets.map((item, index) => {
                    const st = (item.status || "PENDING").toUpperCase();
                    const isPending = st === "PENDING";
                    const isRejected = st === "REJECTED";
                    const isApproved = st === "APPROVED";

                    // Check target user's role
                    const isTargetAdmin = (item.employeeRole || "").toUpperCase() === "ADMIN";
                    const isTargetEmployee = !isTargetAdmin;

                    // Super Admin approves ONLY Department Admin timesheets
                    // Super Admin does NOT approve regular employee timesheets (read-only view)
                    const canSuperAdminApproveThis = isSuperAdmin && isTargetAdmin && isPending;

                    // Department Admin approves ONLY regular Employee timesheets in their department
                    // Admin cannot approve their own timesheet
                    const canAdminApproveThis = isAdmin && isTargetEmployee && isPending;

                    const canApproveThisRow = canSuperAdminApproveThis || canAdminApproveThis;

                    return (
                      <tr key={`${item.projectId}-${item.employeeId}-${item.date}-${index}`}>
                        {/* Project */}
                        <td>
                          <div className="ts-project-cell">
                            <div className="ts-proj-icon">
                              <FaProjectDiagram />
                            </div>
                            <div>
                              <div className="ts-proj-name">
                                {item.projectName || "Project"}
                              </div>
                              <span className="ts-subtext">
                                ID: #{item.projectId}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Employee + Role Badge */}
                        <td>
                          <div className="ts-emp-name-wrap">
                            <span className="ts-emp-name">
                              {item.employeeName || "Employee"}
                            </span>
                            <span
                              className={`ts-role-tag ${
                                isTargetAdmin ? "ts-role-admin" : "ts-role-emp"
                              }`}
                            >
                              {isTargetAdmin ? "Admin" : "Employee"}
                            </span>
                          </div>
                          <span className="ts-subtext">
                            ID: #{item.employeeId}
                          </span>
                        </td>

                        {/* Department */}
                        <td>
                          <span className="ts-dept-badge">
                            {item.department || "-"}
                          </span>
                        </td>

                        {/* Date */}
                        <td>
                          <div className="date-cell">
                            <FaCalendarAlt />
                            {formatDate(item.date)}
                          </div>
                        </td>

                        {/* Work Shift */}
                        <td>
                          <span className="time-value">
                            {formatTime(item.checkIn)} – {formatTime(item.checkOut)}
                          </span>
                        </td>

                        {/* Total Hours */}
                        <td>
                          <span className="ts-hours-badge">
                            {item.totalHours !== null && item.totalHours !== undefined
                              ? `${item.totalHours} hrs`
                              : "0 hrs"}
                          </span>
                        </td>

                        {/* Hourly Rate */}
                        <td>
                          <span className="ts-rate-value">
                            {item.hourlyRate
                              ? `${formatCurrency(item.hourlyRate)}/hr`
                              : "-"}
                          </span>
                        </td>

                        {/* Calculated Pay */}
                        <td>
                          <span className="ts-pay-highlight">
                            {formatCurrency(item.totalPay)}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td>{getStatusBadge(item.status)}</td>

                        {/* Actions / Details */}
                        <td style={{ textAlign: "center" }}>
                          {/* 1. Action Buttons: Rendered ONLY if user is authorized for this row */}
                          {canApproveThisRow && (
                            <div className="ts-action-buttons">
                              <button
                                className="ts-btn-action ts-btn-accept"
                                onClick={() => handleApprove(item)}
                                disabled={actionLoading}
                                title={
                                  isSuperAdmin
                                    ? "Accept Department Admin Timesheet"
                                    : "Accept Employee Timesheet"
                                }
                              >
                                <FaCheck /> Accept
                              </button>
                              <button
                                className="ts-btn-action ts-btn-reject"
                                onClick={() => handleOpenRejectModal(item)}
                                disabled={actionLoading}
                                title={
                                  isSuperAdmin
                                    ? "Reject Department Admin Timesheet (Mandatory Reason)"
                                    : "Reject Employee Timesheet (Mandatory Reason)"
                                }
                              >
                                <FaTimes /> Reject
                              </button>
                            </div>
                          )}

                          {/* 2. Read-Only Notice for Super Admin viewing Regular Employee Timesheet */}
                          {isSuperAdmin && isTargetEmployee && isPending && (
                            <span className="ts-view-only-tag" title="Super Admin has view-only access; must be approved by Department Admin">
                              Awaiting Dept Admin
                            </span>
                          )}

                          {/* 3. Read-Only Notice for Admin viewing Admin's Own Timesheet */}
                          {isAdmin && isTargetAdmin && isPending && (
                            <span className="ts-view-only-tag" title="Awaiting review and approval by Super Admin">
                              Awaiting Super Admin
                            </span>
                          )}

                          {/* 4. Rejection Reason Viewer */}
                          {isRejected && (
                            <button
                              className="ts-btn-action ts-btn-info"
                              onClick={() => handleViewReason(item)}
                              title="Click to view rejection reason"
                            >
                              <FaInfoCircle /> View Reason
                            </button>
                          )}

                          {/* 5. Approved Details */}
                          {isApproved && (
                            <div className="ts-audit-tag">
                              <span>
                                Approved{" "}
                                {item.reviewedBy ? `by ${item.reviewedBy}` : ""}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ==================================================
            MODAL 1: LOG TIMESHEET
        ================================================== */}
        {logModalOpen && (
          <div className="ts-modal-overlay" onClick={() => setLogModalOpen(false)}>
            <div
              className="ts-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ts-modal-header">
                <h3>
                  <FaClock /> Log Work Timesheet
                </h3>
                <button
                  className="ts-modal-close"
                  onClick={() => setLogModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleLogSubmit}>
                <div className="ts-modal-body">
                  <p className="ts-modal-intro">
                    Fill out your shift hours. Your total working hours and
                    salary payout will be automatically calculated and submitted
                    for approval ({isAdmin ? "Super Admin" : "Department Admin"}).
                  </p>

                  {/* Project Selector */}
                  <div className="ts-form-group">
                    <label>Select Project *</label>
                    {projects.length > 0 ? (
                      <select
                        className="ts-input"
                        value={formData.projectId}
                        onChange={handleProjectSelectChange}
                        required
                      >
                        <option value="">-- Choose Project --</option>
                        {projects.map((proj) => (
                          <option key={proj.projectId} value={proj.projectId}>
                            {proj.projectName} (ID: #{proj.projectId})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        className="ts-input"
                        placeholder="Enter Project ID"
                        value={formData.projectId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            projectId: e.target.value,
                            projectName: "Project #" + e.target.value,
                          })
                        }
                        required
                      />
                    )}
                  </div>

                  {/* Date */}
                  <div className="ts-form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      className="ts-input"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Check In & Check Out Row */}
                  <div className="ts-form-row">
                    <div className="ts-form-group">
                      <label>Check In Time *</label>
                      <input
                        type="time"
                        className="ts-input"
                        value={formData.checkIn}
                        onChange={(e) =>
                          setFormData({ ...formData, checkIn: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="ts-form-group">
                      <label>Check Out Time *</label>
                      <input
                        type="time"
                        className="ts-input"
                        value={formData.checkOut}
                        onChange={(e) =>
                          setFormData({ ...formData, checkOut: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Live Calculation Box */}
                  <div className="ts-calc-preview">
                    <div className="ts-calc-row">
                      <span>Calculated Shift Duration:</span>
                      <strong>{previewHours} hours</strong>
                    </div>
                    {estimatedHourlyRate > 0 && (
                      <div className="ts-calc-row">
                        <span>Derived Hourly Rate:</span>
                        <span>{formatCurrency(estimatedHourlyRate)}/hr</span>
                      </div>
                    )}
                    <div className="ts-calc-row ts-calc-highlight">
                      <span>Estimated Payout:</span>
                      <strong>
                        {estimatedHourlyRate > 0
                          ? formatCurrency(estimatedPay)
                          : "Calculated at submission"}
                      </strong>
                    </div>
                    <small className="ts-calc-note">
                      * Hourly rate is calculated automatically from your monthly
                      salary (Salary / 160 hrs). Total pay = Hours × Rate.
                    </small>
                  </div>
                </div>

                <div className="ts-modal-footer">
                  <button
                    type="button"
                    className="ts-btn ts-btn-secondary"
                    onClick={() => setLogModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ts-btn ts-btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Timesheet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================
            MODAL 2: REJECT TIMESHEET (MANDATORY REASON)
        ================================================== */}
        {rejectModalOpen && selectedTimesheet && (
          <div
            className="ts-modal-overlay"
            onClick={() => setRejectModalOpen(false)}
          >
            <div
              className="ts-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ts-modal-header ts-header-danger">
                <h3>
                  <FaTimesCircle /> Reject Timesheet
                </h3>
                <button
                  className="ts-modal-close"
                  onClick={() => setRejectModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleConfirmReject}>
                <div className="ts-modal-body">
                  <div className="ts-summary-card">
                    <div>
                      <strong>Employee:</strong> {selectedTimesheet.employeeName} (ID: #{selectedTimesheet.employeeId})
                    </div>
                    <div>
                      <strong>Role:</strong> {selectedTimesheet.employeeRole || "Employee"}
                    </div>
                    <div>
                      <strong>Project:</strong> {selectedTimesheet.projectName}
                    </div>
                    <div>
                      <strong>Date:</strong> {formatDate(selectedTimesheet.date)}
                    </div>
                    <div>
                      <strong>Logged Hours:</strong> {selectedTimesheet.totalHours} hrs
                    </div>
                  </div>

                  <div className="ts-form-group">
                    <label className="ts-label-required">
                      Mandatory Rejection Reason *
                    </label>
                    <textarea
                      className="ts-textarea"
                      rows={4}
                      placeholder="Specify exactly why this timesheet was rejected so the submitter can correct it..."
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      required
                    ></textarea>
                    <small className="ts-help-text">
                      The reason is required by company policy and will be directly
                      sent to the submitter for remediation.
                    </small>
                  </div>
                </div>

                <div className="ts-modal-footer">
                  <button
                    type="button"
                    className="ts-btn ts-btn-secondary"
                    onClick={() => setRejectModalOpen(false)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ts-btn ts-btn-danger"
                    disabled={actionLoading || !rejectionReasonInput.trim()}
                  >
                    {actionLoading ? "Rejecting..." : "Confirm & Send Rejection"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================================================
            MODAL 3: VIEW REJECTION REASON (FOR EMPLOYEE/ADMIN)
        ================================================== */}
        {reasonModalOpen && selectedTimesheet && (
          <div
            className="ts-modal-overlay"
            onClick={() => setReasonModalOpen(false)}
          >
            <div
              className="ts-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ts-modal-header ts-header-warning">
                <h3>
                  <FaInfoCircle /> Rejection Details
                </h3>
                <button
                  className="ts-modal-close"
                  onClick={() => setReasonModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <div className="ts-modal-body">
                <div className="ts-summary-card">
                  <div>
                    <strong>Project:</strong> {selectedTimesheet.projectName}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDate(selectedTimesheet.date)}
                  </div>
                  <div>
                    <strong>Shift:</strong> {formatTime(selectedTimesheet.checkIn)} – {formatTime(selectedTimesheet.checkOut)} ({selectedTimesheet.totalHours} hrs)
                  </div>
                  {selectedTimesheet.reviewedBy && (
                    <div>
                      <strong>Reviewed By:</strong> {selectedTimesheet.reviewedBy}
                    </div>
                  )}
                  {selectedTimesheet.reviewedAt && (
                    <div>
                      <strong>Reviewed At:</strong>{" "}
                      {new Date(selectedTimesheet.reviewedAt).toLocaleString("en-IN")}
                    </div>
                  )}
                </div>

                <div className="ts-reason-callout">
                  <span className="ts-reason-heading">Reviewer Feedback:</span>
                  <p className="ts-reason-content">
                    {selectedTimesheet.rejectionReason || "No details provided."}
                  </p>
                </div>

                <p className="ts-subtext" style={{ marginTop: 12 }}>
                  Please review the feedback above and submit a corrected timesheet
                  entry if needed.
                </p>
              </div>

              <div className="ts-modal-footer">
                <button
                  type="button"
                  className="ts-btn ts-btn-primary"
                  onClick={() => setReasonModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Timesheet;