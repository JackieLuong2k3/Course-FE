"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AUTH_COOKIE,
  AUTH_STORAGE_TOKEN,
  AUTH_STORAGE_USER,
  AUTH_USER_NAME_COOKIE,
} from "@/lib/auth";

function clearAuthCookies() {
  const past = "max-age=0; path=/; SameSite=Lax";
  document.cookie = `${AUTH_COOKIE}=; ${past}`;
  document.cookie = `${AUTH_USER_NAME_COOKIE}=; ${past}`;
}

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearAuthCookies();
    try {
      localStorage.removeItem(AUTH_STORAGE_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_USER);
    } catch {
      /* ignore */
    }
    router.push("/");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
