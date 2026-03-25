// course page
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";
import { toast } from "sonner";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: "S" | "Pres" | "TC" | "MTC" | string;
  kindOfCourse: string;
  totalLessons: number;
};

type Props = {
  courses: Course[];
  apiBase: string;
  loadError: string | null;
};

const LEVELS = ["All", "S", "Pres", "TC", "MTC"] as const;
type LevelFilter = (typeof LEVELS)[number];

export function CoursesPage({
  courses,
  apiBase,
  loadError,
}: Props) {
  const router = useRouter();
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [loadingEnrolled, setLoadingEnrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("All");

  useEffect(() => {
    let cancelled = false;

    async function loadEnrolled() {
      const token = localStorage.getItem(AUTH_STORAGE_TOKEN);
      if (!token) {
        setEnrolledIds(new Set());
        return;
      }

      setLoadingEnrolled(true);
      try {
        const res = await fetch(`${apiBase}/api/courses/enrolled`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = (await res.json()) as { courses?: Array<any> };
        const ids = new Set(
          (data.courses ?? [])
            .map((c) => c?.id ?? c?._id)
            .filter(Boolean)
            .map((id) => String(id)),
        );
        if (!cancelled) setEnrolledIds(ids);
      } finally {
        if (!cancelled) setLoadingEnrolled(false);
      }
    }

    loadEnrolled();
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const hasCourses = courses.length > 0;

  const isEnrolled = useMemo(() => {
    return (courseId: string) => enrolledIds.has(String(courseId));
  }, [enrolledIds]);

  const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem(AUTH_STORAGE_TOKEN);
    if (!token) {
      alert("Bạn cần đăng nhập để đăng ký khóa học.");
      router.push("/login");
      return;
    }

    try {
      setLoadingEnrolled(true);
      const res = await fetch(`${apiBase}/api/users/enroll/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        toast.error(err?.message || "Lỗi khi đăng ký khóa học.");
        return;
      }

      setEnrolledIds((prev) => {
        const next = new Set(prev);
        next.add(String(courseId));
        return next;
      });
      toast.success("Đăng ký thành công! Khóa học đã được thêm vào danh sách của bạn.");
    } catch (err: any) {
      toast.error("Không kết nối được server. Vui lòng thử lại.");
    } finally {
      setLoadingEnrolled(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery = q.length === 0 || c.title.toLowerCase().includes(q);
      const matchesLevel =
        levelFilter === "All" || String(c.level) === levelFilter;
      return matchesQuery && matchesLevel;
    });
  }, [courses, levelFilter, query]);

  if (!hasCourses) {
    return (
      <div className="col-span-full text-sm text-zinc-500 dark:text-zinc-400">
        {loadError ?? "Không có khóa học nào."}
      </div>
    );
  }

  return (
    <div className="col-span-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses by name..."
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="level-filter"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Level
          </label>
          <select
            id="level-filter"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
          No results
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);

            return (
              <Card
                key={course.id}
                className="cursor-pointer overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ paddingTop: "56.25%" }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge>{course.kindOfCourse}</Badge>
                      {enrolled ? <Badge variant="secondary">Enrolled</Badge> : null}
                    </div>
                    <span className="text-sm font-semibold">
                      {course.totalLessons} lessons
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">{String(course.level)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="mb-3 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {course.description}
                  </p>
                  <Button
                    className="w-full"
                    disabled={enrolled || loadingEnrolled}
                    onClick={(e) => handleEnroll(course.id, e)}
                  >
                    {enrolled ? "Enrolled" : "Enroll now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

