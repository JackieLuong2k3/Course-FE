"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PlayCircle, CheckCircle2 } from "lucide-react";

const defaultApiBase = "http://localhost:5000";

type Lesson = {
  id: string;
  _id?: string;
  title?: string;
  order?: number;
  duration?: number;
  lessonProgress?: {
    status?: "not-started" | "in-progress" | "completed";
  };
};

type Course = {
  id: string;
  title: string;
  lessons?: Lesson[];
};

export function SidebarLesson() {
  const pathname = usePathname();
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? defaultApiBase;

  const { courseId, activeLessonId } = useMemo(() => {
    // Expected: /my-course/:courseId/lesson/:lessonId
    const parts = (pathname ?? "").split("/").filter(Boolean);
    return {
      courseId: parts[1] ?? null,
      activeLessonId: parts[3] ?? null,
    };
  }, [pathname]);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchCourse() {
      if (!courseId) return;
      const token = localStorage.getItem(AUTH_STORAGE_TOKEN);
      if (!token) return;

      try {
        setLoading(true);
        const res = await fetch(`${apiBase}/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setCourse(data);
        }
      } catch (e) {
        console.error("Failed to fetch sidebar lessons", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchCourse();

    return () => {
      cancelled = true;
    };
  }, [apiBase, courseId]);

  if (!courseId) return null;

  return (
    <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-l bg-muted/20 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b bg-background z-10 sticky top-0">
        <h2 className="font-semibold text-lg line-clamp-2">
          {course?.title ?? "Course Content"}
        </h2>
        <div className="text-sm text-zinc-500 mt-1">
          {course?.lessons?.length ?? 0} lessons
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-sm text-zinc-500">Loading lessons...</div>
        ) : (
          <div className="flex flex-col">
            {(course?.lessons ?? []).map((lesson, index) => {
              const lessonIdRaw = lesson._id ?? lesson.id;
              const isActive = String(lessonIdRaw) === String(activeLessonId);
              const status = lesson.lessonProgress?.status ?? "not-started";
              const isCompleted = status === "completed";

              return (
                <Link
                  key={lessonIdRaw ?? index}
                  href={`/my-course/${courseId}/lesson/${lessonIdRaw}`}
                  className={`group flex items-start gap-3 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${isActive ? "bg-muted font-medium border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                    }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <PlayCircle className={`w-5 h-5 ${isActive ? "text-primary" : "text-zinc-400 group-hover:text-primary/70"}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className={`text-sm leading-tight mb-1 ${isActive ? "text-foreground" : "text-zinc-600 dark:text-zinc-300"}`}>
                      {lesson.order ? `${lesson.order}. ` : ""}
                      {lesson.title ?? "Untitled lesson"}
                    </div>
                    {lesson.duration ? (
                      <div className="text-xs text-zinc-500">{lesson.duration} seconds</div>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}