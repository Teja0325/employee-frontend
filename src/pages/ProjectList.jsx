import { useEffect, useState } from "react";
import {
  getProjects,
  getProjectsByDepartment,
  getProjectsByEmployee,
  deleteProject,
  getMyProfile,
} from "../services/ApiService";

import Layout from "../components/Layout";
import "../css/ProjectList.css";

import { useNavigate } from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";
import AssignTeamModal from "../components/AssignTeamModal";

function ProjectList() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [permissions, setPermissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setPermissions(JSON.parse(localStorage.getItem("permissions") || "[]"));
      } catch {
        setPermissions([]);
      }
    };
    window.addEventListener("permissionsUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("permissionsUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const canWriteProject = permissions.includes("project:write");
  const userRole = (localStorage.getItem("role") || "").toUpperCase();
  // Only Department Admin assigns employees from their department
  const canAssignTeam = userRole === "ADMIN" && canWriteProject;

  // ======================================================
  // DELETE PROJECT ID & ASSIGN MODAL PROJECT
  // ======================================================
  const [deleteId, setDeleteId] = useState(null);
  const [assignModalProject, setAssignModalProject] = useState(null);

  // ======================================================
  // LOAD PROJECTS
  // ======================================================
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const currentRole = (localStorage.getItem("role") || "").toUpperCase();
      const employeeId = localStorage.getItem("employeeId");

      let response;
      if (currentRole === "SUPER_ADMIN") {
        response = await getProjects();
      } else if (currentRole === "ADMIN") {
        try {
          const profRes = await getMyProfile();
          const dept = profRes.data?.department;
          if (dept) {
            response = await getProjectsByDepartment(dept);
          } else {
            response = await getProjects();
          }
        } catch {
          response = await getProjects();
        }
      } else if (currentRole === "EMPLOYEE" && employeeId) {
        response = await getProjectsByEmployee(employeeId);
      } else {
        response = await getProjects();
      }

      setProjects(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD WHEN PAGE OPENS
  // ======================================================
  useEffect(() => {
    loadProjects();
  }, []);

  // ======================================================
  // DELETE PROJECT
  // ======================================================
  const handleDelete = async () => {
    if (deleteId === null) {
      return;
    }

    try {
      await deleteProject(deleteId);
      setDeleteId(null);
      await loadProjects();
    } catch (err) {
      console.error(err);
      alert("Unable to delete project");
    }
  };

  // ======================================================
  // EDIT PROJECT
  // ======================================================
  const handleEdit = (projectId) => {
    navigate(`/projects/edit/${projectId}`);
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <Layout>
        <div className="project-page">
          <div className="project-loading">
            <div className="project-spinner"></div>
            <p>Loading projects...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================
  return (
    <Layout>
      <div className="project-page">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}
        <div className="project-header">
          <div className="project-header-text">
            <h2>Projects</h2>
            <p>Manage projects, review requirements, and assign department employees</p>
          </div>

          {userRole === "SUPER_ADMIN" && canWriteProject && (
            <button
              className="add-project-btn"
              onClick={() => navigate("/projects/add")}
            >
              <span className="add-project-icon">+</span>
              Add Project
            </button>
          )}
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}
        {error && <div className="project-error">{error}</div>}

        {/* ==================================================
            PROJECT TABLE WRAPPER
        ================================================== */}
        <div className="project-table-card">
          <div className="project-table-scroll">
            <table className="project-table">
              {/* ==================================================
                  TABLE HEADER
              ================================================== */}
              <thead>
                <tr>
                  <th className="col-id">Project ID</th>
                  <th className="col-project-name">Project Name</th>
                  <th className="col-department">Department</th>
                  <th className="col-skills">Skills Required</th>
                  <th className="col-headcount">Team Needed</th>
                  <th className="col-team">Assigned Team</th>
                  <th className="col-assignment-status">Assignment Status</th>
                  <th className="col-progress">Work Progress</th>
                  <th className="col-remaining">Amount Remaining</th>
                  <th className="col-date">Start Date</th>
                  <th className="col-date">End Date</th>
                  <th className="col-description">Description</th>
                  <th className="col-project-status">Project Status</th>
                  {canWriteProject && <th className="col-actions">Actions</th>}
                </tr>
              </thead>

              {/* ==================================================
                  TABLE BODY
              ================================================== */}
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canWriteProject ? 14 : 13}
                      className="no-projects"
                    >
                      No projects found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.projectId}>
                      {/* PROJECT ID */}
                      <td className="col-id">{project.projectId}</td>

                      {/* PROJECT NAME */}
                      <td className="project-name-cell">
                        {project.projectName || "-"}
                      </td>

                      {/* DEPARTMENT */}
                      <td>{project.department || "-"}</td>

                      {/* SKILLS REQUIRED */}
                      <td>
                        {project.skillsRequired ? (
                          <span className="skills-badge" title={project.skillsRequired}>
                            {project.skillsRequired}
                          </span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>-</span>
                        )}
                      </td>

                      {/* TEAM NEEDED */}
                      <td>
                        <strong style={{ color: "#334155" }}>
                          {project.noOfEmployeesNeeded || 1}
                        </strong>{" "}
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {(project.noOfEmployeesNeeded || 1) === 1 ? "member" : "members"}
                        </span>
                      </td>

                      {/* ASSIGNED TEAM */}
                      <td>
                        {project.assignments && project.assignments.length > 0 ? (
                          project.assignments.map((a) => (
                            <span className="team-pill" key={a.id || a.employeeId}>
                              {a.employeeName}
                            </span>
                          ))
                        ) : project.employeeName ? (
                          <span className="team-pill">{project.employeeName}</span>
                        ) : (
                          <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "13px" }}>
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* ASSIGNMENT STATUS */}
                      <td>
                        <span
                          className={`assignment-badge ${
                            project.assignmentStatus === "ASSIGNED"
                              ? "assigned"
                              : "pending"
                          }`}
                        >
                          {project.assignmentStatus === "ASSIGNED"
                            ? "Assigned"
                            : "Pending Assignment"}
                        </span>
                      </td>

                      {/* WORK PROGRESS */}
                      <td>
                        <div className="progress-wrapper">
                          <div className="progress-bar-background">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${project.workProgress || 0}%`,
                              }}
                            ></div>
                          </div>
                          <span className="progress-text">
                            {project.workProgress || 0}%
                          </span>
                        </div>
                      </td>

                      {/* AMOUNT REMAINING */}
                      <td>
                        <span className="remaining-value">
                          {project.amountOfWorkRemaining || 0}%
                        </span>
                      </td>

                      {/* START DATE */}
                      <td>{project.startDate || "-"}</td>

                      {/* END DATE */}
                      <td>{project.endDate || "-"}</td>

                      {/* DESCRIPTION */}
                      <td className="description-cell">
                        <div className="description-text">
                          {project.description || "-"}
                        </div>
                      </td>

                      {/* PROJECT STATUS */}
                      <td>
                        <span
                          className={`project-status ${
                            project.projectStatus
                              ? project.projectStatus.toLowerCase()
                              : ""
                          }`}
                        >
                          {project.projectStatus || "-"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      {canWriteProject && (
                        <td className="actions-cell">
                          {canAssignTeam && (
                            <button
                              className={`assign-team-btn ${
                                project.assignmentStatus === "PENDING_ASSIGNMENT"
                                  ? "pending-action"
                                  : ""
                              }`}
                              onClick={() => setAssignModalProject(project)}
                              title="Assign employees to this project"
                            >
                              Assign Team
                            </button>
                          )}

                          <button
                            className="edit-project-btn"
                            onClick={() => handleEdit(project.projectId)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-project-btn"
                            onClick={() => setDeleteId(project.projectId)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================
            DELETE CONFIRMATION MODAL
        ================================================== */}
        <ConfirmModal
          isOpen={deleteId !== null}
          title="Delete Project?"
          message="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />

        {/* ==================================================
            ASSIGN TEAM MODAL
        ================================================== */}
        <AssignTeamModal
          isOpen={assignModalProject !== null}
          project={assignModalProject}
          onClose={() => setAssignModalProject(null)}
          onAssigned={loadProjects}
        />
      </div>
    </Layout>
  );
}

export default ProjectList;