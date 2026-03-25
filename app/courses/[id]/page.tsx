import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { LessonsList } from "./lessons-list";

type Lesson = {
  id?: string;
  _id?: string;
  title?: string;
  order?: number;
  duration?: number;
  status?: "not-started" | "in-progress" | "completed";
  thumbnail?: string;
};

type Course = {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  kindOfCourse: string;
  totalLessons: number;
  lessons?: Lesson[];
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const API_BASE = process.env.API_URL ?? "http://localhost:5000";

  let course: Course | null = null;
  let loadError: string | null = null;

  try {
    const res = await fetch(`${API_BASE}/api/courses/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    course = (await res.json()) as Course;
  } catch {
    loadError = "Không tải được thông tin khóa học.";
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {!course ? (
          <div className="rounded-lg border bg-background p-4 text-sm text-zinc-500 dark:text-zinc-400">
            {loadError ?? "Course not found."}
          </div>
        ) : (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border">
              <div
                className="relative w-full overflow-hidden"
                style={{ paddingTop: "40%" }}
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              </div>
              <div className="space-y-3 p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{course.kindOfCourse}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  <Badge variant="outline">{course.totalLessons} lessons</Badge>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {course.title}
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {course.description}
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Lessons</h2>
              <LessonsList
                lessons={course.lessons ?? []}
                courseThumbnail={course.thumbnail}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}