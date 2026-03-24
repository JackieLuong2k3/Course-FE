"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  void error;

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Đã xảy ra lỗi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Có lỗi trong quá trình tải dữ liệu. Bạn có thể thử lại.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={reset} type="button">
              Thử lại
            </Button>
            <Link href="/" prefetch={false}>
              <Button variant="outline" type="button">
                Về trang chủ
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

