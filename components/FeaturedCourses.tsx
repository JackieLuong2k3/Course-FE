"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTH_STORAGE_TOKEN } from "@/lib/auth";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  kindOfCourse: string;
  totalLessons: number;
  progress: number;
  status: string;
};

type Props = {
  courses: Course[];
  apiBase: string;
  loadError: string | null;
};

export function FeaturedCourses({
  courses,
  apiBase,
  loadError,
}: Props) {
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [loadingEnrolled, setLoadingEnrolled] = useState(false);

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

  if (!hasCourses) {
    return (
      <div className="col-span-full text-sm text-zinc-500 dark:text-zinc-400">
        {loadError ?? "Không có khóa học nào."}
      </div>
    );
  }

  return (
    <>
      {courses.map((course) => {
        const enrolled = isEnrolled(course.id);

        return (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative h-40">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover"
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
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Level: {course.level}
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="mb-3 flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.progress}%
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  progress
                </span>
              </div>
              <p className="mb-3 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                {course.description}
              </p>
              <Button className="w-full" disabled={enrolled || loadingEnrolled}>
                {enrolled ? "Enrolled" : "Enroll now"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

