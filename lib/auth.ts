export const AUTH_COOKIE = "auth_session";

/** Readable cookie for server components (display name after login) */
export const AUTH_USER_NAME_COOKIE = "course_user_name";

/** Client-side localStorage keys after successful login */
export const AUTH_STORAGE_TOKEN = "course_token";
export const AUTH_STORAGE_USER = "course_user";

export function isDemoLoginValid(email: string, password: string): boolean {
  const trimmed = email.trim();
  return trimmed.length > 0 && password.length >= 4;
}
