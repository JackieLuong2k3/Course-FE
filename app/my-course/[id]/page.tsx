import { AppHeader } from "@/components/AppHeader";
import { MyCourseCourseClient } from "@/app/my-course/course-client";

export default function MyCourseCoursePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />
      <MyCourseCourseClient />
      hihi
    </div>
  );
}