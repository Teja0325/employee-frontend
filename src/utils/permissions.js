export const getStoredPermissions = () => {
  try {
    return JSON.parse(localStorage.getItem("permissions") || "[]");
  } catch (e) {
    return [];
  }
};

export const hasPermission = (permission) => {
  const perms = getStoredPermissions();
  return Array.isArray(perms) && perms.includes(permission);
};

