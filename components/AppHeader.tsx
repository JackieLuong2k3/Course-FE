import Link from "next/link";

type Props = {
  showAuth?: boolean;
};

export function AppHeader({ showAuth = true }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          App
        </Link>
        {showAuth && (
          <nav className="flex flex-wrap items-center gap-2 sm:justify-end">
            
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              Đăng nhập
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
