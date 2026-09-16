import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getRolePermissions,
  updateRolePermissions,
  resetRolePermissions
} from "../services/ApiService";
import {
  FaShieldAlt,
  FaSave,
  FaUndo,
  FaCheck,
  FaTimes,
  FaUserTie,
  FaUserShield,
  FaUser,
  FaSearch,
  FaLock,
  FaInfoCircle
} from "react-icons/fa";
import { toast } from "sonner";
import "../css/RolesPermissions.css";

function RolesPermissions() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeRole, setActiveRole] = useState("ADMIN");
  const [searchQuery, setSearchQuery] = useState("");
  const [matrix, setMatrix] = useState({
    SUPER_ADMIN: [],
    ADMIN: [],
    EMPLOYEE: []
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);

  const currentRole = localStorage.getItem("role");
  const isSuperAdmin = currentRole === "SUPER_ADMIN";

  // =====================================================
  // LOAD ROLE PERMISSIONS MATRIX
  // =====================================================
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getRolePermissions();
      if (response.data) {
        setMatrix(response.data.matrix || {});
        setAvailablePermissions(response.data.availablePermissions || []);
      }
    } catch (error) {
      console.error("Failed to load role permissions:", error);
      toast.error("Failed to load roles and permissions matrix");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // TOGGLE PERMISSION FOR ACTIVE ROLE
  // =====================================================
  const handleToggle = (permissionId) => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admin is allowed to modify role permissions");
      return;
    }

    setMatrix((prev) => {
      const currentList = prev[activeRole] || [];
      const updatedList = currentList.includes(permissionId)
        ? currentList.filter((p) => p !== permissionId)
        : [...currentList, permissionId];

      return {
        ...prev,
        [activeRole]: updatedList
      };
    });
  };

  // =====================================================
  // QUICK SELECTION HELPERS
  // =====================================================
  const handleSelectAll = () => {
    if (!isSuperAdmin) return;
    const allIds = availablePermissions.map((p) => p.id);
    setMatrix((prev) => ({
      ...prev,
      [activeRole]: allIds
    }));
  };

  const handleDeselectAll = () => {
    if (!isSuperAdmin) return;
    setMatrix((prev) => ({
      ...prev,
      [activeRole]: []
    }));
  };

  // =====================================================
  // SAVE PERMISSIONS FOR ACTIVE ROLE
  // =====================================================
  const handleSave = async () => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admin can save permission changes");
      return;
    }

    try {
      setSaving(true);
      const permissionsToSave = matrix[activeRole] || [];

      const response = await updateRolePermissions(activeRole, permissionsToSave);

      toast.success(
        response.data?.message || `Permissions saved successfully for ${activeRole}!`
      );

      // If Super Admin modified their own role's permissions, refresh local permissions
      if (activeRole === currentRole) {
        localStorage.setItem(
          "permissions",
          JSON.stringify(response.data?.permissions || permissionsToSave)
        );
      }
      window.dispatchEvent(new Event("permissionsUpdated"));
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error(
        error.response?.data?.message || `Failed to save permissions for ${activeRole}`
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET ALL ROLES TO FACTORY DEFAULTS
  // =====================================================
  const handleReset = async () => {
    if (!isSuperAdmin) {
      toast.error("Only Super Admin can reset factory defaults");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reset all role permissions back to factory defaults?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await resetRolePermissions();
      if (response.data?.matrix) {
        setMatrix(response.data.matrix);
        if (response.data.matrix[currentRole]) {
          localStorage.setItem(
            "permissions",
            JSON.stringify(response.data.matrix[currentRole])
          );
          window.dispatchEvent(new Event("permissionsUpdated"));
        }
      }
      toast.success("All permissions reset to factory defaults!");
    } catch (error) {
      console.error("Failed to reset permissions:", error);
      toast.error("Failed to reset permissions to default");
    } finally {
      setLoading(false);
    }
  };

  // Filter permissions based on search input
  const filteredPermissions = availablePermissions.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (p.label && p.label.toLowerCase().includes(query)) ||
      (p.id && p.id.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  });

  // Group filtered permissions by category
  const categories = Array.from(
    new Set(filteredPermissions.map((p) => p.category || "General"))
  );

  const activePermissionsList = matrix[activeRole] || [];

  return (
    <Layout>
      <div className="roles-permissions-page">
        {/* ===================================================
            PAGE HEADER
        =================================================== */}
        <div className="rp-header">
          <div className="rp-header-title-group">
            <div className="rp-icon-badge">
              <FaShieldAlt />
            </div>
            <div>
              <h1>Roles &amp; Permissions</h1>
              <p>Configure dynamic access control policies and capabilities for system roles</p>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="rp-header-actions">
              <button
                type="button"
                className="btn-rp-reset"
                onClick={handleReset}
                title="Reset all roles to system factory defaults"
              >
                <FaUndo />
                <span>Reset Defaults</span>
              </button>
            </div>
          )}
        </div>

        {/* ===================================================
            ROLE NAVIGATION TABS (Underlined modern tabs)
        =================================================== */}
        <div className="rp-role-tabs-bar">
          <div className="rp-tabs-list">
            <button
              type="button"
              className={`rp-tab-btn ${activeRole === "SUPER_ADMIN" ? "active" : ""}`}
              onClick={() => setActiveRole("SUPER_ADMIN")}
            >
              <FaUserShield className="rp-tab-icon" />
              <span>Super Administrator</span>
              <span className="rp-tab-badge">
                {(matrix["SUPER_ADMIN"] || []).length} / {availablePermissions.length}
              </span>
            </button>

            <button
              type="button"
              className={`rp-tab-btn ${activeRole === "ADMIN" ? "active" : ""}`}
              onClick={() => setActiveRole("ADMIN")}
            >
              <FaUserTie className="rp-tab-icon" />
              <span>Administrator</span>
              <span className="rp-tab-badge">
                {(matrix["ADMIN"] || []).length} / {availablePermissions.length}
              </span>
            </button>

            <button
              type="button"
              className={`rp-tab-btn ${activeRole === "EMPLOYEE" ? "active" : ""}`}
              onClick={() => setActiveRole("EMPLOYEE")}
            >
              <FaUser className="rp-tab-icon" />
              <span>Employee</span>
              <span className="rp-tab-badge">
                {(matrix["EMPLOYEE"] || []).length} / {availablePermissions.length}
              </span>
            </button>
          </div>
        </div>

        {/* ===================================================
            LOADING STATE
        =================================================== */}
        {loading ? (
          <div className="rp-loading-state">
            <div className="rp-spinner"></div>
            <p>Loading role permissions matrix...</p>
          </div>
        ) : (
          <>
            {/* ===================================================
                ROLE CONTROL & FILTER BAR
            =================================================== */}
            <div className="rp-control-card">
              <div className="rp-role-summary">
                <div className="rp-role-badge-tag">
                  {activeRole === "SUPER_ADMIN" && "System Owner"}
                  {activeRole === "ADMIN" && "Department Manager"}
                  {activeRole === "EMPLOYEE" && "Standard User"}
                </div>
                <div className="rp-role-details">
                  <h3>
                    Policy Configuration for{" "}
                    <strong>{activeRole.replace("_", " ")}</strong>
                  </h3>
                  <p>
                    {!isSuperAdmin
                      ? "Read-only preview: Super Admin permissions required to make changes."
                      : activeRole === "SUPER_ADMIN"
                      ? "Super Admin accounts have global administrative governance across the entire organization."
                      : activeRole === "ADMIN"
                      ? "Administrators manage employees and timesheets within their assigned department."
                      : "Standard employees have self-service access to log time and review projects."}
                  </p>
                </div>
              </div>

              <div className="rp-toolbar">
                {/* Search Box */}
                <div className="rp-search-wrap">
                  <FaSearch className="rp-search-icon" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rp-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="rp-clear-search"
                      onClick={() => setSearchQuery("")}
                    >
                      
                    </button>
                  )}
                </div>

                {isSuperAdmin && (
                  <div className="rp-quick-btn-group">
                    <button
                      type="button"
                      className="rp-btn-action"
                      onClick={handleSelectAll}
                      title="Grant all permissions to this role"
                    >
                      <FaCheck /> Select All
                    </button>
                    <button
                      type="button"
                      className="rp-btn-action"
                      onClick={handleDeselectAll}
                      title="Revoke all permissions from this role"
                    >
                      <FaTimes /> Deselect All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ===================================================
                PERMISSION CATEGORIES & SWITCH CARDS
            =================================================== */}
            {categories.length === 0 ? (
              <div className="rp-empty-results">
                <FaInfoCircle className="rp-empty-icon" />
                <h4>No permissions match "{searchQuery}"</h4>
                <p>Try searching with another keyword or clear the search filter.</p>
                <button
                  type="button"
                  className="rp-btn-clear"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              categories.map((category) => {
                const permsInCategory = filteredPermissions.filter(
                  (p) => (p.category || "General") === category
                );

                const grantedCount = permsInCategory.filter((p) =>
                  activePermissionsList.includes(p.id)
                ).length;

                return (
                  <div key={category} className="rp-category-section">
                    <div className="rp-category-header">
                      <div className="rp-category-name">
                        <span>{category}</span>
                        <span className="rp-category-count">
                          {grantedCount} of {permsInCategory.length} active
                        </span>
                      </div>
                      <div className="rp-category-divider"></div>
                    </div>

                    <div className="rp-grid">
                      {permsInCategory.map((perm) => {
                        const isChecked = activePermissionsList.includes(perm.id);

                        return (
                          <div
                            key={perm.id}
                            className={`rp-card ${isChecked ? "is-granted" : "is-restricted"} ${
                              !isSuperAdmin ? "is-disabled" : ""
                            }`}
                            onClick={() => handleToggle(perm.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleToggle(perm.id);
                              }
                            }}
                          >
                            <div className="rp-card-main">
                              <div className="rp-card-header">
                                <span className="rp-perm-name">{perm.label}</span>
                                <span
                                  className={`rp-status-tag ${
                                    isChecked ? "tag-granted" : "tag-restricted"
                                  }`}
                                >
                                  {isChecked ? "Granted" : "Restricted"}
                                </span>
                              </div>

                              <p className="rp-perm-desc">{perm.description}</p>

                              <div className="rp-card-footer">
                                <span className="rp-perm-code">
                                  <FaLock className="rp-code-icon" />
                                  {perm.id}
                                </span>

                                {/* Modern Toggle Switch */}
                                <div
                                  className={`rp-switch ${isChecked ? "active" : ""}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(perm.id);
                                  }}
                                >
                                  <div className="rp-switch-handle"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            {/* ===================================================
                STICKY BOTTOM SAVE BAR
            =================================================== */}
            {isSuperAdmin && (
              <div className="rp-save-bar">
                <div className="rp-save-info">
                  <span className="rp-save-dot"></span>
                  <span>
                    Currently assigned:{" "}
                    <strong>
                      {activePermissionsList.length} of {availablePermissions.length} permissions
                    </strong>{" "}
                    to <strong>{activeRole.replace("_", " ")}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  className="rp-btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <FaSave />
                  <span>
                    {saving
                      ? "Saving Changes..."
                      : `Save Permissions for ${activeRole.replace("_", " ")}`}
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default RolesPermissions;
