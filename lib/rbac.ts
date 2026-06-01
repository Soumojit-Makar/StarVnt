// lib/rbac.ts
// ─── Role definitions ─────────────────────────────────────────────────────────

export type Role = "VENDOR" | "ADMIN";
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

// What each role is permitted to do
export const PERMISSIONS = {
  // Inquiry permissions
  "inquiry:read:own":    ["VENDOR", "ADMIN"],
  "inquiry:read:all":   ["ADMIN"],
  "inquiry:update:own": ["VENDOR", "ADMIN"],
  "inquiry:update:all": ["ADMIN"],
  "inquiry:delete":     ["ADMIN"],

  // Profile permissions
  "profile:read:own":   ["VENDOR", "ADMIN"],
  "profile:update:own": ["VENDOR", "ADMIN"],
  "profile:update:all": ["ADMIN"],

  // Manual event permissions
  "event:create":       ["VENDOR", "ADMIN"],
  "event:read:own":     ["VENDOR", "ADMIN"],
  "event:update:own":   ["VENDOR", "ADMIN"],
  "event:delete:own":   ["VENDOR", "ADMIN"],
  "event:read:all":     ["ADMIN"],

  // Analytics permissions
  "analytics:own":      ["VENDOR", "ADMIN"],
  "analytics:all":      ["ADMIN"],

  // User management
  "user:list":          ["ADMIN"],
  "user:create":        ["ADMIN"],
  "user:suspend":       ["ADMIN"],
  "user:activate":      ["ADMIN"],
  "user:delete":        ["ADMIN"],

  // Admin panel
  "admin:access":       ["ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a role has a permission
 */
export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

/**
 * Server-side guard — throws if the session user lacks permission.
 * Use in Server Actions.
 */
export function requirePermission(
  role: Role | undefined,
  permission: Permission
): void {
  if (!role || !can(role, permission)) {
    throw new Error(`FORBIDDEN: requires ${permission}`);
  }
}

/**
 * Returns a typed permission-check function bound to a role.
 * Convenience for component/page use.
 */
export function createAbility(role: Role) {
  return (permission: Permission) => can(role, permission);
}
