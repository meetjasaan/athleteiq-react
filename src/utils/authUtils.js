/**
 * Authentication Utilities
 * Handles RBAC (Role-Based Access Control) and user session management
 */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  DIRECTOR: 'director',
  PLAYER: 'player',
  PARENT: 'parent',
};

// Check if user has access to a route
export const hasRoleAccess = (userRole, requiredRoles) => {
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

// Get current user from SessionStorage
export const getCurrentUser = () => {
  const sessionData = sessionStorage.getItem('athleteiq_session');
  if (!sessionData) return null;
  try {
    return JSON.parse(sessionData);
  } catch (err) {
    return null;
  }
};

// Save user session
export const saveUserSession = (user) => {
  sessionStorage.setItem('athleteiq_session', JSON.stringify(user));
};

// Clear session on logout
export const clearUserSession = () => {
  sessionStorage.removeItem('athleteiq_session');
};

// Create a mock super admin for demo purposes
export const createSuperAdminSession = () => {
  const superAdmin = {
    id: 'super_admin_001',
    email: 'admin@athleteiq.com',
    name: 'System Administrator',
    role: ROLES.SUPER_ADMIN,
    mfaVerified: true,
    loginTime: new Date().toISOString(),
  };
  saveUserSession(superAdmin);
  return superAdmin;
};

// Verify MFA (mock for demo)
export const verifyMFA = (code) => {
  // Mock: any 6-digit code is valid
  return /^\d{6}$/.test(code);
};
