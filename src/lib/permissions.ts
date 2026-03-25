export const PERMISSIONS = {
  PROJECTS_READ:    "projects:read",
  PROJECTS_CREATE:  "projects:create",
  PROJECTS_EDIT:    "projects:edit",
  PROJECTS_DELETE:  "projects:delete",
  BLOG_READ:        "blog:read",
  BLOG_CREATE:      "blog:create",
  BLOG_EDIT:        "blog:edit",
  BLOG_DELETE:      "blog:delete",
  NEWS_READ:        "news:read",
  NEWS_CREATE:      "news:create",
  NEWS_EDIT:        "news:edit",
  NEWS_DELETE:      "news:delete",
  SUBMISSIONS_READ: "submissions:read",
  CONTACTS_READ:    "contacts:read",
  CONTENT_EDIT:     "content:edit",
  USERS_MANAGE:     "users:manage",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Check if user has a specific permission
export function hasPermission(
  userPermissions: string[],
  permission: Permission
): boolean {
  return userPermissions.includes(permission);
}

// Check if user has ANY of the given permissions
export function hasAnyPermission(
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  return permissions.some(p => userPermissions.includes(p));
}