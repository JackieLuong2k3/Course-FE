import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <Suspense
          fallback={
            <Card className="mx-auto w-full max-w-md p-8 text-center text-sm text-zinc-500">
              Đang tải…
            </Card>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
