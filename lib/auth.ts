export const AUTH_COOKIE = "auth_session";

export function isDemoLoginValid(email: string, password: string): boolean {
  const trimmed = email.trim();
  return trimmed.length > 0 && password.length >= 4;
}
