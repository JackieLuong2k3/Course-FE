"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultApiBase = "http://localhost:5000";

type Lesson = {
  id: string;
  title?: string;
  order?: number;
  status?: "not-started" | "in-progress" | "completed";
  progress?: number;
};

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  kindOfCourse: string;
  totalLessons: number;
  lessons?: Lesson[];
};

function statusToBadgeVariant(
  status?: Lesson["status"],
): "outline" | "secondary" | "default" {
  if (!status) return "outline";
  if (status === "completed") return "secondary";
  if (status === "in-progress") return "default";
  return "outline";
}

function toParamsId(idParam: string | string[] | undefined) {
  if (!idParam) return null;
  return Array.isArray(idParam) ? idParam[0] : idParam;
}

export function MyCourseCourseClient() {
  const router = useRouter();
  const params = useParams();
  const courseId = toParamsId(params.id as string | string[] | undefined);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiBase;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!courseId) return;
      setLoading(true);
      setError(null);

      const token = localStorage.getItem(AUTH_STORAGE_TOKEN);
      if (!token) {
        setLoading(false);
        setError("Bạn cần đăng nhập để xem khóa học của mình.");
        return;
      }

      try {
        const res = await fetch(`${apiBase}/api/courses/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          if (res.status === 401) {
            router.replace("/login");
            return;
          }
          setError(data?.message ?? "Không thể tải khóa học.");
          return;
        }

        const data = (await res.json()) as { courses?: Course[] };
        const found = (data.courses ?? []).find((c) => c.id === courseId);
        if (!found) {
          setError("Không tìm thấy khóa học này trong danh sách của bạn.");
          return;
        }

        if (!cancelled) setCourse(found);
      } catch {
        if (!cancelled) setError("Không kết nối được API. Hãy kiểm tra backend.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apiBase, courseId, router]);

  const computedCourse = useMemo(() => {
    if (!course) return null;
    const lessons = course.lessons ?? [];
    const avg =
      lessons.length > 0
        ? Math.round(lessons.reduce((sum, l) => sum + (l.progress ?? 0), 0) / lessons.length)
        : 0;

    return { ...course, progress: avg, status: avg >= 100 ? "completed" : avg > 0 ? "in-progress" : "not-started" } as const;
  }, [course]);

  if (!courseId) {
    return <div className="text-sm text-zinc-500 dark:text-zinc-400">Thiếu course id.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      {loading ? (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải...</div>
      ) : error ? (
        <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
          {error}
        </div>
      ) : !computedCourse ? null : (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge>{computedCourse.kindOfCourse}</Badge>
                <Badge variant="secondary">{computedCourse.level}</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                {computedCourse.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {computedCourse.description}
              </p>
            </div>
            <div className="min-w-48 rounded-lg border bg-background/50 p-4">
              <div className="text-sm text-zinc-600 dark:text-zinc-300">Progress</div>
              <div className="mt-1 text-2xl font-semibold">{computedCourse.progress}%</div>
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {computedCourse.status}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Lessons</div>
            <div className="grid gap-3 md:grid-cols-2">
              {(computedCourse.lessons ?? []).map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-2">
                      {lesson.order ? `${lesson.order}. ` : ""}
                      {lesson.title ?? "Untitled"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={statusToBadgeVariant(lesson.status)}>
                        {lesson.status ?? "not-started"}
                      </Badge>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {lesson.progress ?? 0}%
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push(`/my-course/${courseId}/lesson/${lesson.id}`);
                      }}
                    >
                      Mở bài
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

