"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultApiBase = "http://localhost:5000";

type LessonProgressResponse = {
  progress?: {
    status?: "not-started" | "in-progress" | "completed";
  };
};

function statusToBadgeVariant(
  status?: "not-started" | "in-progress" | "completed",
): "outline" | "secondary" | "default" {
  if (!status) return "outline";
  if (status === "completed") return "secondary";
  if (status === "in-progress") return "default";
  return "outline";
}

export function MyCourseLessonClient() {
  const router = useRouter();
  const pathname = usePathname();

  const { courseId, lessonIdResolved } = useMemo(() => {
    // Expected: /my-course/:courseId/lesson/:lessonId
    const parts = (pathname ?? "").split("/").filter(Boolean);
    return {
      courseId: parts[1] ?? null,
      lessonIdResolved: parts[3] ?? null,
    };
  }, [pathname]);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiBase;

  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "not-started" | "in-progress" | "completed"
  >("not-started");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lessonProgressPercent = useMemo(() => {
    if (status === "completed") return 100;
    if (status === "in-progress") return 50;
    return 0;
  }, [status]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!courseId || !lessonIdResolved) return;

      setLoading(true);
      setError(null);

      const token = localStorage.getItem(AUTH_STORAGE_TOKEN);
      if (!token) {
        setLoading(false);
        setError("Bạn cần đăng nhập để xem tiến độ bài học.");
        return;
      }

      try {
        // Fetch course to get lesson title (unprotected)
        const courseRes = await fetch(`${apiBase}/api/courses/${courseId}`);
        const courseData = (await courseRes.json().catch(() => null)) as any;

        const foundLesson = (courseData?.lessons ?? []).find(
          (l: any) => String(l.id ?? l._id) === String(lessonIdResolved),
        );
        if (!cancelled) setLessonTitle(foundLesson?.title ?? "Lesson");

        // Fetch progress (protected)
        const progRes = await fetch(
          `${apiBase}/api/courses/${courseId}/lessons/${lessonIdResolved}/progress`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!progRes.ok) {
          const data = await progRes.json().catch(() => null);
          if (progRes.status === 401) {
            router.replace("/login");
            return;
          }
          if (progRes.status === 404) {
            if (!cancelled) setStatus("not-started");
            return;
          }
          if (!cancelled) setError(data?.message ?? "Không thể tải tiến độ.");
          return;
        }

        const progData = (await progRes.json().catch(() => null)) as LessonProgressResponse;
        const nextStatus =
          progData?.progress?.status ?? ("not-started" as const);
        if (!cancelled) setStatus(nextStatus);
      } catch {
        if (!cancelled)
          setError("Không kết nối được API. Hãy kiểm tra backend.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apiBase, courseId, lessonIdResolved, router]);

  if (!courseId || !lessonIdResolved) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        Thiếu courseId/lessonId.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {loading ? (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải...</div>
      ) : error ? (
        <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/my-course/${courseId}`)}
            >
              Quay lại khóa học
            </Button>
            <Badge variant={statusToBadgeVariant(status)}>{status}</Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{lessonTitle ?? "Lesson"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  Progress
                </div>
                <div className="text-sm font-semibold">{lessonProgressPercent}%</div>
              </div>

              <div className="rounded-lg border bg-background/50 p-4 text-sm text-zinc-500 dark:text-zinc-400">
                Trang demo hiển thị tiến độ bài học.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

