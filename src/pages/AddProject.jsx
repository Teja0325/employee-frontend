import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { addProject } from "../services/ApiService";

import Layout from "../components/Layout";
import "../css/ProjectForm.css";

function AddProject() {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    projectName: "",
    department: "",
    noOfEmployeesNeeded: 1,
    skillsRequired: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================================================
  // CHECK USER ROLE & PRELOAD DEPARTMENT FOR ADMIN
  // ======================================================
  useEffect(() => {
    const role = (localStorage.getItem("role") || "").toUpperCase();
    if (role !== "SUPER_ADMIN") {
      alert("Access denied: Only Super Admin can create new project requests.");
      navigate("/projects");
    }
  }, [navigate]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // SUBMIT PROJECT
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!project.projectName.trim()) {
      setError("Project Name is required");
      return;
    }

    if (!project.department.trim()) {
      setError("Department is required");
      return;
    }

    if (!project.noOfEmployeesNeeded || Number(project.noOfEmployeesNeeded) < 1) {
      setError("Please specify at least 1 employee needed");
      return;
    }

    if (!project.skillsRequired.trim()) {
      setError("Skills Required is required");
      return;
    }

    if (!project.startDate || !project.endDate) {
      setError("Both Start Date and Deadline (End Date) are required");
      return;
    }

    if (new Date(project.startDate) > new Date(project.endDate)) {
      setError("Deadline (End Date) cannot be earlier than Start Date");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const projectData = {
        projectName: project.projectName.trim(),
        department: project.department.trim(),
        noOfEmployeesNeeded: Number(project.noOfEmployeesNeeded),
        skillsRequired: project.skillsRequired.trim(),
        startDate: project.startDate,
        endDate: project.endDate,
        description: project.description.trim(),
        workProgress: 0,
        amountOfWorkRemaining: 100,
        status: "NOT_STARTED",
        employeeStatus: "UNASSIGNED",
        projectStatus: "ACTIVE",
        assignmentStatus: "PENDING_ASSIGNMENT",
      };

      await addProject(projectData);

      alert("Project request created successfully! The Department Admin can now assign employees.");

      navigate("/projects");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to create project request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="project-form-page">
        <div className="project-form-container">
          <div className="project-form-header">
            <h2>Add Project</h2>
            <p>
              Specify project requirements, target department, required skills, and headcount.
            </p>
          </div>

          {error && (
            <div className="project-form-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* PROJECT NAME */}
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                name="projectName"
                value={project.projectName}
                onChange={handleChange}
                placeholder="e.g. Enterprise Cloud Migration"
                required
              />
            </div>

            {/* DEPARTMENT */}
            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={project.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="Software Development">Software Development</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Testing">Testing</option>
              </select>
            </div>

            {/* EMPLOYEES NEEDED (HEADCOUNT) */}
            <div className="form-group">
              <label>Number of Employees Needed *</label>
              <input
                type="number"
                name="noOfEmployeesNeeded"
                min="1"
                max="50"
                value={project.noOfEmployeesNeeded}
                onChange={handleChange}
                placeholder="e.g. 3"
                required
              />
            </div>

            {/* SKILLS REQUIRED */}
            <div className="form-group">
              <label>Skills Required *</label>
              <input
                type="text"
                name="skillsRequired"
                value={project.skillsRequired}
                onChange={handleChange}
                placeholder="e.g. React, Spring Boot, MySQL, Docker"
                required
              />
            </div>

            {/* TIME PERIOD / DEADLINE (START & END DATE) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={project.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Deadline (End Date) *</label>
                <input
                  type="date"
                  name="endDate"
                  value={project.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                name="description"
                value={project.description}
                onChange={handleChange}
                placeholder="Describe project scope, deliverables, and expectations..."
                rows="4"
              />
            </div>

            {/* BUTTONS */}
            <div className="project-form-buttons">
              <button
                type="button"
                className="cancel-project-btn"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-project-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AddProject;