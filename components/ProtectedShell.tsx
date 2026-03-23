import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

type Props = {
  children: React.ReactNode;
};

export function ProtectedShell({ children }: Props) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="text-base font-semibold tracking-tight text-foreground"
          >
            App
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Trang chủ
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
