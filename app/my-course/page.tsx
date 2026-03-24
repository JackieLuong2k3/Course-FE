import { AppHeader } from "@/components/AppHeader";
import { MyCourseClient } from "./my-course-client";

export default function MyCoursePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <AppHeader />
      <MyCourseClient />
    </div>
  );
}
