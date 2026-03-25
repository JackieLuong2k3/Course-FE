"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Lesson = {
  id?: string;
  _id?: string;
  title?: string;
  order?: number;
  duration?: number;
  status?: "not-started" | "in-progress" | "completed";
  thumbnail?: string;
};

type Props = {
  lessons: Lesson[];
  courseThumbnail: string;
};

const PAGE_SIZE = 6;

export function LessonsList({ lessons, courseThumbnail }: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(lessons.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return lessons.slice(start, start + PAGE_SIZE);
  }, [lessons, safePage]);

  return (
    <div className="space-y-3">
      {lessons.length === 0 ? (
        <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
          No lessons found
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[72px_220px_500px_120px] gap-3 border-b bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              <span>NO.</span>
              <span>Lesson</span>
              <span>Thumb</span>
              <span>Duration</span>
            </div>
            {paged.map((lesson, index) => {
              const lessonId = lesson.id ?? lesson._id ?? `${index}`;
              const status = lesson.status ?? "not-started";
              const thumb = lesson.thumbnail ?? courseThumbnail;
              return (
                <div
                  key={lessonId}
                  className="grid grid-cols-[72px_220px_500px_120px] items-center gap-3 border-b px-3 py-2 last:border-b-0"
                >
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {lesson.order ?? index + 1}
                  </div>
                  <div className="min-w-0 truncate text-base font-medium">
                    {lesson.title ?? "Untitled lesson"}
                  </div>
                  <div className="h-24 w-full overflow-hidden rounded-md">
                    <img
                      src={thumb}
                      alt={lesson.title ?? "Lesson"}
                      className="h-full  object-contain"
                    />
                  </div>

                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {lesson.duration ?? 0} mins
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Page {safePage}/{totalPages} - {lessons.length} lessons
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

