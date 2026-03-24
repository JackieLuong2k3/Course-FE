"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";

const defaultApiBase = "http://localhost:5000";

type Lesson = {
  id?: string;
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

export function MyCourseClient() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiBase;

  useEffect(() => {
    let cancelled = false;

    async function loadEnrolled() {
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

        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 401) {
            router.replace("/login");
            return;
          }
          const data = await res.json().catch(() => null);
          setError(data?.message ?? "Không thể tải khóa học.");
          return;
        }

        const data = (await res.json()) as { courses?: Course[] };
        setCourses(data.courses ?? []);
      } catch {
        if (cancelled) return;
        setError("Không kết nối được API. Hãy kiểm tra backend.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEnrolled();
    return () => {
      cancelled = true;
    };
  }, [apiBase, router]);

  const computedCourses = useMemo(() => {
    return courses.map((course) => {
      const lessons = course.lessons ?? [];
      const lessonProgress =
        lessons.length > 0
          ? Math.round(
              lessons.reduce((sum, l) => sum + (l.progress ?? 0), 0) /
                lessons.length,
            )
          : 0;

      return {
        ...course,
        progress: lessonProgress,
        status:
          lessonProgress >= 100
            ? ("completed" as const)
            : lessonProgress > 0
              ? ("in-progress" as const)
              : ("not-started" as const),
      };
    });
  }, [courses]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Courses</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Xem trạng thái và tiến độ từng bài học.
          </p>
        </div>

        {error ? (
          <div className="text-right text-sm text-zinc-500 dark:text-zinc-400">
            {error}{" "}
            <Link href="/login" className="underline underline-offset-4">
              Đăng nhập
            </Link>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải...</div>
      ) : error && computedCourses.length === 0 ? (
        <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
          {error}
        </div>
      ) : computedCourses.length === 0 ? (
        <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
          Không có khóa học nào.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {computedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative h-40">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <CardHeader>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Badge>{course.kindOfCourse}</Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>
                  <Badge variant="outline">{course.totalLessons} lessons</Badge>
                </div>

                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-600 dark:text-zinc-300">
                    Progress
                  </div>
                  <div className="text-sm font-semibold">{course.progress}%</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Lessons</div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!course.lessons || course.lessons.length === 0}
                      onClick={() => {
                        const firstLesson = course.lessons?.[0];
                        if (!firstLesson?.id) return;
                        router.push(
                          `/my-course/${course.id}`,
                        );
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

