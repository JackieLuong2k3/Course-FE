import { AppHeader } from "@/components/AppHeader";
import { MyCourseLessonClient } from "@/app/my-course/lesson-client";
import { SidebarLesson } from "@/app/my-course/sidebar-lesson";

export default function MyCourseLessonPage() {
  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <AppHeader />
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        <div className="flex-1 overflow-y-auto">
          <MyCourseLessonClient />
        </div>
        <SidebarLesson />
      </div>
    </div>
  );
}
