import { useEffect, useState } from "react";
import { getProject, updateProject } from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import "../css/ProjectForm.css";

function EditProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    projectName: "",
    employeeId: "",
    employeeName: "",
    department: "",
    noOfEmployeesNeeded: 1,
    skillsRequired: "",
    workProgress: "",
    amountOfWorkRemaining: "",
    status: "",
    startDate: "",
    endDate: "",
    description: "",
    employeeStatus: "",
    projectStatus: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD PROJECT
  // ======================================================
  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProject(projectId);
        const data = response.data;

        setProject({
          projectName: data.projectName || "",
          employeeId: data.employeeId || "",
          employeeName: data.employeeName || "",
          department: data.department || "",
          noOfEmployeesNeeded: data.noOfEmployeesNeeded || 1,
          skillsRequired: data.skillsRequired || "",
          workProgress: data.workProgress ?? "",
          amountOfWorkRemaining: data.amountOfWorkRemaining ?? "",
          status: data.status || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          description: data.description || "",
          employeeStatus: data.employeeStatus || "",
          projectStatus: data.projectStatus || "",
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({
      ...project,
      [name]: value,
    });
  };

  // ======================================================
  // UPDATE PROJECT
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const projectData = {
        projectName: project.projectName,
        employeeId: project.employeeId ? Number(project.employeeId) : null,
        employeeName: project.employeeName,
        department: project.department,
        noOfEmployeesNeeded: Number(project.noOfEmployeesNeeded) || 1,
        skillsRequired: project.skillsRequired || "",
        workProgress:
          project.workProgress !== "" ? Number(project.workProgress) : null,
        amountOfWorkRemaining:
          project.amountOfWorkRemaining !== ""
            ? Number(project.amountOfWorkRemaining)
            : null,
        status: project.status,
        startDate: project.startDate || null,
        endDate: project.endDate || null,
        description: project.description,
        employeeStatus: project.employeeStatus,
        projectStatus: project.projectStatus,
      };

      await updateProject(projectId, projectData);
      alert("Project updated successfully");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="project-form-page">
          <p>Loading project...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="project-form-page">
        <div className="project-form-container">
          <div className="project-form-header">
            <h2>Edit Project</h2>
            <p>Update project requirements, schedule, and details</p>
          </div>

          {error && <div className="project-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* PROJECT NAME */}
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                name="projectName"
                value={project.projectName}
                onChange={handleChange}
                required
              />
            </div>

            {/* DEPARTMENT */}
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                value={project.department}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMPLOYEES NEEDED & SKILLS REQUIRED */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>Number of Employees Needed *</label>
                <input
                  type="number"
                  name="noOfEmployeesNeeded"
                  min="1"
                  value={project.noOfEmployeesNeeded}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Skills Required *</label>
                <input
                  type="text"
                  name="skillsRequired"
                  value={project.skillsRequired}
                  onChange={handleChange}
                  placeholder="e.g. React, Java, MySQL"
                  required
                />
              </div>
            </div>

            {/* ASSIGNED TEAM / EMPLOYEE NAME */}
            <div className="form-group">
              <label>Assigned Team Member(s)</label>
              <input
                type="text"
                name="employeeName"
                value={project.employeeName}
                onChange={handleChange}
                placeholder="Team members can also be managed via 'Assign Team' in Projects list"
              />
            </div>

            {/* WORK PROGRESS & AMOUNT REMAINING */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>Work Progress (%)</label>
                <input
                  type="number"
                  name="workProgress"
                  min="0"
                  max="100"
                  value={project.workProgress}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Amount of Work Remaining (%)</label>
                <input
                  type="number"
                  name="amountOfWorkRemaining"
                  min="0"
                  max="100"
                  value={project.amountOfWorkRemaining}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={project.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            {/* START DATE & DEADLINE */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={project.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Deadline (End Date)</label>
                <input
                  type="date"
                  name="endDate"
                  value={project.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={project.description}
                onChange={handleChange}
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
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditProject;