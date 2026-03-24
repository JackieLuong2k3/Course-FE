import { AppHeader } from "@/components/AppHeader";
import { MyCourseLessonClient } from "@/app/my-course/lesson-client";

export default function MyCourseLessonPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />
      <MyCourseLessonClient />
    </div>
  );
}

