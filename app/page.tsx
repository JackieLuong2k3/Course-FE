import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronRight, Play, Search, Star, Users } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "The Complete Web Developer",
    instructor: "John Smith",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=500&fit=crop",
    rating: 4.8,
    reviews: 2500,
    students: 12000,
    price: 99.99,
    level: "Beginner",
  },
  {
    id: 2,
    title: "React - Advanced Patterns",
    instructor: "Sarah Johnson",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    rating: 4.9,
    reviews: 1800,
    students: 8500,
    price: 89.99,
    level: "Advanced",
  },
  {
    id: 3,
    title: "JavaScript Masterclass",
    instructor: "Mike Brown",
    image:
      "https://images.unsplash.com/photo-1516534775068-bb57e39c8ac4?w=800&h=500&fit=crop",
    rating: 4.7,
    reviews: 3200,
    students: 15000,
    price: 79.99,
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Python for Data Science",
    instructor: "Emma Davis",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    rating: 4.8,
    reviews: 2100,
    students: 9800,
    price: 84.99,
    level: "Beginner",
  },
];

const categories = [
  { name: "Web Development", count: 1200 },
  { name: "Mobile Development", count: 800 },
  { name: "Data Science", count: 950 },
  { name: "Machine Learning", count: 680 },
  { name: "UI/UX Design", count: 450 },
  { name: "Digital Marketing", count: 620 },
];

export default function Home() {
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
            {categories.map((category) => (
              <Card
                key={category.name}
                className="cursor-pointer p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <CardTitle className="text-sm">{category.name}</CardTitle>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {category.count} courses
                </p>
              </Card>
            ))}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge>{course.level}</Badge>
                    <span className="text-sm font-semibold">${course.price}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {course.instructor}
                  </p>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="mb-3 flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-400">
                      ({course.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {course.students.toLocaleString()} students
                  </p>
                  <Button className="w-full">Enroll now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
