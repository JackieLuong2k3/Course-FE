import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_USER_NAME_COOKIE } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { ThemeToggle } from "@/components/theme-toggle";

type Props = {
  showAuth?: boolean;
};

export async function AppHeader({ showAuth = true }: Props) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === "1";
  const rawName = cookieStore.get(AUTH_USER_NAME_COOKIE)?.value;
  let displayName: string | null = null;
  if (rawName) {
    try {
      displayName = decodeURIComponent(rawName);
    } catch {
      displayName = rawName;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Course Platform
        </Link>
        {showAuth && (
          <nav className="flex flex-wrap items-center gap-2 sm:justify-end">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                prefetch={false}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                Home
              </Link>
              <Link
                href="/my-course"
                prefetch={false}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                My Courses
              </Link>
            </div>

            {isAuthed ? (
              <>
                {displayName ? (
                  <span className="rounded-lg px-3 py-2 text-sm font-medium text-foreground">
                    Xin chào, {displayName}
                  </span>
                ) : null}
                <ThemeToggle />
                <LogoutButton />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Link
                href="/login"
                prefetch={false}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                Đăng nhập
              </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
