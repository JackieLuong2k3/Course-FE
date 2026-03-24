"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AUTH_COOKIE,
  AUTH_STORAGE_TOKEN,
  AUTH_STORAGE_USER,
  AUTH_USER_NAME_COOKIE,
} from "@/lib/auth";

const defaultApiBase = "http://localhost:5000";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiBase;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json()) as {
        message?: string;
        token?: string;
        user?: { id: string; name: string; email: string; role: string };
      };

      if (!res.ok) {
        setError(data.message ?? "Đăng nhập thất bại");
        return;
      }

      if (!data.token || !data.user?.name) {
        setError("Phản hồi máy chủ không hợp lệ");
        return;
      }

      const maxAge = 60 * 60 * 24 * 7;
      const cookieOpts = `path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `${AUTH_COOKIE}=1; ${cookieOpts}`;
      document.cookie = `${AUTH_USER_NAME_COOKIE}=${encodeURIComponent(data.user.name)}; ${cookieOpts}`;

      try {
        localStorage.setItem(AUTH_STORAGE_TOKEN, data.token);
        localStorage.setItem(AUTH_STORAGE_USER, JSON.stringify(data.user));
      } catch {
        /* ignore quota / private mode */
      }

      const from = searchParams.get("from");
      const dest =
        from && from.startsWith("/") && !from.startsWith("//") ? from : "/";
      router.push(dest);
      router.refresh();
    } catch {
      setError("Không kết nối được API. Hãy chạy backend và kiểm tra NEXT_PUBLIC_API_URL.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Đăng nhập</CardTitle>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Nhập email và mật khẩu tài khoản của bạn.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mật khẩu
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="text-foreground underline-offset-4 hover:underline">
              Về trang chủ
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
