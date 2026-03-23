import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LoginForm } from "@/components/LoginForm";

function LoginFallback() {
  return (
    <div className="flex min-h-[12rem] w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      Đang tải form…
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
