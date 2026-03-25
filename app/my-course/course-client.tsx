"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


const defaultApiBase = "http://localhost:5000";

type Lesson = {
  id: string;
  _id?: string;
  title?: string;
  order?: number;
  duration?: number;
  status?: "not-started" | "in-progress" | "completed";
  progress?: number;
  lessonProgress?: {
    status?: "not-started" | "in-progress" | "completed";
  }
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

function statusClass(status?: Lesson["status"]): string {
  if (status === "completed") {
    return "inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700";
  }
  if (status === "in-progress") {
    return "inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700";
  }
  return "inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700";
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
  const [lessonStatusFilter, setLessonStatusFilter] = useState<
    "all" | "not-started" | "in-progress" | "completed"
  >("all");
  const [lessonPage, setLessonPage] = useState(1);
  const [lessonTimes, setLessonTimes] = useState<Record<string, number>>({});

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiBase;

  useEffect(() => {
    const times: Record<string, number> = {};
    const token = localStorage.getItem(AUTH_STORAGE_TOKEN);

    if (course?.lessons) {
      course.lessons.forEach((l) => {
        const lid = l.id ?? l._id;
        if (lid) {
          const val = localStorage.getItem(`lesson_time_${lid}`);
          const watched = val ? parseInt(val, 10) : 0;
          times[lid] = watched;

          const duration = l.duration ?? 0;
          if (watched >= duration && duration > 0 && l.lessonProgress?.status !== "completed") {
            if (token && courseId) {
              fetch(`${apiBase}/api/courses/${courseId}/lessons/${lid}/status`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "completed" }),
              }).catch(() => { });
            }
          }
        }
      });
    }
    setLessonTimes(times);
  }, [course, courseId, apiBase]);

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
        const res = await fetch(`${apiBase}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          console.log(data);
          if (res.status === 401) {
            router.replace("/login");
            return;
          }
          setError(data?.message ?? "Không thể tải khóa học.");
          return;
        }

        const found = (await res.json()) as any;
        console.log("Data khoá học lấy về:", found);

        if (!found) {
          setError("Không tìm thấy khóa học này.");
          return;
        }

        // Map _id to id if backend uses _id
        if (found._id && !found.id) found.id = found._id;

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
        ? Math.round(
          lessons.reduce(
            (sum, l) => sum + (l.progress ?? 0),
            0,
          ) / lessons.length,
        )
        : 0;

    return {
      ...course,
      progress: avg,
      status:
        avg >= 100 ? "completed" : avg > 0 ? "in-progress" : "not-started",
    } as const;
  }, [course]);

  const filteredLessons = useMemo(() => {
    const lessons = computedCourse?.lessons ?? [];
    if (lessonStatusFilter === "all") return lessons;
    return lessons.filter(
      (lesson) => (lesson.status ?? "not-started") === lessonStatusFilter,
    );
  }, [computedCourse?.lessons, lessonStatusFilter]);

  const LESSONS_PAGE_SIZE = 6;
  const totalLessonPages = Math.max(
    1,
    Math.ceil(filteredLessons.length / LESSONS_PAGE_SIZE),
  );
  const safeLessonPage = Math.min(lessonPage, totalLessonPages);

  const pagedLessons = useMemo(() => {
    const start = (safeLessonPage - 1) * LESSONS_PAGE_SIZE;
    return filteredLessons.slice(start, start + LESSONS_PAGE_SIZE);
  }, [filteredLessons, safeLessonPage]);

  const handleOpenLesson = async (lesson: Lesson) => {
    if (!courseId) return;
    const lessonIdResolved = lesson._id ?? lesson.id;
    const token = localStorage.getItem(AUTH_STORAGE_TOKEN);
    if (token) {
      if (lesson.lessonProgress?.status !== "completed") {
        const watched = lessonTimes[lessonIdResolved] ?? 0;
        const duration = lesson.duration ?? 0;
        const isCompleted = watched >= duration && duration > 0;

        fetch(`${apiBase}/api/courses/${courseId}/lessons/${lessonIdResolved}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: isCompleted ? "completed" : "in-progress" }),
        }).catch(() => { });
      }
      if (computedCourse?.status !== "completed") {
        fetch(`${apiBase}/api/courses/${courseId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "in-progress" }),
        }).catch(() => { });
      }
    }
    router.push(`/my-course/${courseId}/lesson/${lessonIdResolved}`);
  };

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
                <Badge variant="destructive">Level {computedCourse.level}</Badge>
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                {computedCourse.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {computedCourse.description}
              </p>
            </div>

          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Lessons1</div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="lesson-status-filter"
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Status
                </label>
                <select
                  id="lesson-status-filter"
                  value={lessonStatusFilter}
                  onChange={(e) => {
                    setLessonStatusFilter(
                      e.target.value as
                      | "all"
                      | "not-started"
                      | "in-progress"
                      | "completed",
                    );
                    setLessonPage(1);
                  }}
                  className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground shadow-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
                >
                  <option value="all">all</option>
                  <option value="not-started">not-started</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                </select>
              </div>
            </div>

            {filteredLessons.length === 0 ? (
              <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
                No lessons found
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-lg border">
                  <div className="grid grid-cols-[72px_220px_240px_110px_120px_100px] gap-3 border-b bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    <span>NO.</span>
                    <span>Lesson</span>
                    <span>Thumb</span>
                    <span>Duration</span>
                    <span>Status</span>
                    <span>Action</span>
                  </div>
                  {pagedLessons.map((lesson, index) => {
                    const thumb = computedCourse.thumbnail;
                    return (

                      <div
                        key={lesson._id ?? lesson.id ?? `${index}`}
                        className="grid grid-cols-[72px_220px_240px_110px_120px_100px] items-center gap-3 border-b px-3 py-2 last:border-b-0"
                      >
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          {lesson.order ?? index + 1}
                        </div>
                        <div className="min-w-0 truncate text-sm font-medium">
                          {lesson.title ?? "Untitled lesson"}
                        </div>
                        <div className="h-16 w-full overflow-hidden rounded-md">
                          <img
                            src={thumb}
                            alt={lesson.title ?? "Lesson"}
                            className="h-full object-contain"
                          />
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          {lesson.duration ?? 0} seconds
                        </div>
                        <div>
                          <span className={statusClass(lesson.lessonProgress?.status)}>
                            {lesson.lessonProgress?.status ?? "not-started"}
                          </span>
                        </div>
                        {/* call api`${apiBase}/api/courses/${courseId}/lessons/${lessonIdResolved}/status`, */}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenLesson(lesson)}
                        >
                          Mở bài
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Page {safeLessonPage}/{totalLessonPages} - {filteredLessons.length} lessons
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safeLessonPage <= 1}
                      onClick={() =>
                        setLessonPage((p) => Math.max(1, p - 1))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safeLessonPage >= totalLessonPages}
                      onClick={() =>
                        setLessonPage((p) => Math.min(totalLessonPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

