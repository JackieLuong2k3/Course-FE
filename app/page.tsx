import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Play, Search, Star, Users } from "lucide-react";
import { FeaturedCourses } from "@/components/FeaturedCourses";

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

export default async function Home({
  searchParams,
}: {
  // Next.js App Router (server) passes searchParams as a Promise.
  searchParams?: Promise<{ page?: string | string[] }>;
}) {
  const API_BASE = process.env.API_URL ?? "http://localhost:5000";

  let courses: Course[] = [];
  let loadError: string | null = null;

  try {
    const res = await fetch(`${API_BASE}/api/courses`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    courses = (await res.json()) as Course[];
  } catch {
    loadError = "Không tải được danh sách khóa học từ server.";
  }

  const pageSize = 9;
  const sp = await searchParams;
  const rawPage =
    typeof sp?.page === "string"
      ? sp.page
      : Array.isArray(sp?.page)
        ? sp.page[0]
        : undefined;
  const page = Math.max(1, Number(rawPage ?? 1) || 1);
  const totalPages = Math.max(1, Math.ceil(courses.length / pageSize));
  const pagedCourses = courses.slice((page - 1) * pageSize, page * pageSize);

  const categories = Object.entries(
    courses.reduce<Record<string, number>>((acc, c) => {
      acc[c.kindOfCourse] = (acc[c.kindOfCourse] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, count]) => ({ name, count }));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />

      <section className="border-b bg-gradient-to-b from-zinc-100 to-background dark:from-zinc-900">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-5">
            <Badge>Online learning platform</Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Learn from industry experts
            </h1>
            <p className="max-w-prose text-zinc-600 dark:text-zinc-400">
              Discover thousands of practical courses and level up your career
              with hands-on content.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Search for any course..." />
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                50M+ students
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                4.7 avg rating
              </span>
            </div>
          </div>
          <Card className="hidden items-center justify-center lg:flex">
            <CardContent className="flex w-full flex-col items-center gap-3 py-10">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                <Play className="h-10 w-10" />
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Start learning today
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="mb-5 text-xl font-semibold sm:text-2xl">Top categories</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.length ? (
              categories.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <CardTitle className="text-sm">{category.name}</CardTitle>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {category.count} courses
                </p>
              </Card>
              ))
            ) : (
              <div className="col-span-full text-sm text-zinc-500 dark:text-zinc-400">
                {loadError ?? "Không có dữ liệu."}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold sm:text-2xl">Featured courses</h2>
            <Link
              href="#"
              className="inline-flex items-center text-sm text-zinc-600 hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeaturedCourses
              courses={pagedCourses}
              apiBase={API_BASE}
              loadError={loadError}
            />
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link
                  href={`/?page=${page - 1}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </span>
              )}

              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Page {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/?page=${page + 1}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
