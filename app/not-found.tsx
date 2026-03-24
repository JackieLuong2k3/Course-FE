import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-6 bg-background px-4 py-16 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight">404</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Trang bạn tìm không tồn tại hoặc đã bị thay đổi.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="outline" size="sm">
            Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
}