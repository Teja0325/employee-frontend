import { useState, useEffect } from "react";
import { getEmployees, assignProjectEmployees, getProjectAssignments } from "../services/ApiService";
import "../css/AssignTeamModal.css";

function AssignTeamModal({ isOpen, project, onClose, onAssigned }) {
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !project) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch available employees
        const empRes = await getEmployees();
        const allEmps = empRes.data || [];

        // Filter employees to match the project's department (if specified)
        const deptEmps = project.department
          ? allEmps.filter(
              (e) =>
                (e.department || "").toLowerCase() ===
                project.department.toLowerCase()
            )
          : allEmps;

        setEmployees(deptEmps);

        // 2. Fetch or initialize currently assigned employee IDs
        let initialSelected = [];
        if (project.assignments && project.assignments.length > 0) {
          initialSelected = project.assignments.map((a) => Number(a.employeeId));
        } else if (project.projectId) {
          try {
            const assignRes = await getProjectAssignments(project.projectId);
            if (assignRes.data && assignRes.data.length > 0) {
              initialSelected = assignRes.data.map((a) => Number(a.employeeId));
            } else if (project.employeeId) {
              initialSelected = [Number(project.employeeId)];
            }
          } catch {
            if (project.employeeId) {
              initialSelected = [Number(project.employeeId)];
            }
          }
        }
        setSelectedIds(initialSelected);
      } catch (err) {
        console.error("Failed to load department employees for assignment:", err);
        setError("Failed to load department employees");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const targetCount = project.noOfEmployeesNeeded || 1;
  const isMaxReached = selectedIds.length >= targetCount;

  const toggleEmployee = (empId) => {
    const id = Number(empId);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      setError("");
    } else {
      if (selectedIds.length >= targetCount) {
        setError(`You can only select up to ${targetCount} employee${targetCount === 1 ? "" : "s"} for this project. Deselect an employee to select someone else.`);
        return;
      }
      setSelectedIds([...selectedIds, id]);
      setError("");
    }
  };

  const handleSave = async () => {
    if (selectedIds.length !== targetCount) {
      setError(`Please select exactly ${targetCount} employee${targetCount === 1 ? "" : "s"} as required (currently selected: ${selectedIds.length}).`);
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await assignProjectEmployees(project.projectId, selectedIds);
      alert("Project team assignment saved successfully!");
      if (onAssigned) {
        onAssigned();
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save team assignment");
    } finally {
      setSubmitting(false);
    }
  };
  const currentCount = selectedIds.length;
  let headcountClass = "match";
  if (currentCount < targetCount) headcountClass = "under";
  if (currentCount > targetCount) headcountClass = "over";

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
    const jobTitle = (emp.jobTitle || "").toLowerCase();
    return fullName.includes(term) || jobTitle.includes(term);
  });

  return (
    <div className="assign-modal-overlay" onClick={onClose}>
      <div
        className="assign-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="assign-modal-header">
          <div>
            <h3 className="assign-modal-title">Assign Department Team</h3>
            <p className="assign-modal-subtitle">
              Project: <strong>{project.projectName}</strong> ({project.department})
            </p>
          </div>
          <button className="assign-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Requirements Meta Bar */}
        <div className="assign-meta-grid">
          <div className="assign-meta-item">
            <span className="assign-meta-label">Skills Required</span>
            <span className="assign-meta-val">
              <span className="skills-pill">
                {project.skillsRequired || "Not specified"}
              </span>
            </span>
          </div>

          <div className="assign-meta-item">
            <span className="assign-meta-label">Headcount Needed</span>
            <span className="assign-meta-val">
              {targetCount} {targetCount === 1 ? "Employee" : "Employees"}
            </span>
          </div>

          <div className="assign-meta-item">
            <span className="assign-meta-label">Deadline</span>
            <span className="assign-meta-val">
              {project.endDate || project.startDate || "Ongoing"}
            </span>
          </div>
        </div>

        {/* Search & Selection Counter */}
        <div className="assign-search-bar-wrap">
          <input
            type="text"
            className="assign-search-input"
            placeholder="Search employees by name or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={`headcount-badge ${headcountClass}`}>
            Selected: {currentCount} / {targetCount}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{ padding: "0 24px", color: "#b91c1c", fontSize: "13px" }}>
            {error}
          </div>
        )}

        {/* Employee List */}
        <div className="assign-employee-list">
          {loading ? (
            <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
              Loading department employees...
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p style={{ textAlign: "center", color: "#64748b", padding: "20px" }}>
              No employees found in {project.department || "this department"}.
            </p>
          ) : (
            filteredEmployees.map((emp) => {
              const isChecked = selectedIds.includes(Number(emp.employeeId));
              const isDisabled = !isChecked && isMaxReached;
              return (
                <div
                  key={emp.employeeId}
                  className={`assign-employee-item ${isChecked ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                  onClick={() => !isDisabled && toggleEmployee(emp.employeeId)}
                  title={isDisabled ? `Target limit of ${targetCount} reached. Deselect an employee first.` : ""}
                >
                  <input
                    type="checkbox"
                    className="assign-checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => {}} // Controlled by row click
                  />

                  <div className="assign-emp-info">
                    <span className="assign-emp-name">
                      {emp.firstName} {emp.lastName}
                    </span>
                    <span className="assign-emp-sub">
                      {emp.jobTitle || "Employee"} • ID: {emp.employeeId}
                    </span>
                  </div>

                  <div className="assign-emp-meta">
                    <span>{emp.yearsOfExperience ? `${emp.yearsOfExperience} yrs exp` : ""}</span>
                    {emp.rating != null && (
                      <span className="emp-rating">★ {emp.rating.toFixed(1)}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="assign-modal-footer">
          <button
            type="button"
            className="assign-btn-cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="assign-btn-submit"
            onClick={handleSave}
            disabled={submitting || selectedIds.length !== targetCount}
          >
            {submitting ? "Saving Team..." : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignTeamModal;

