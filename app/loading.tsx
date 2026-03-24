import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="flex items-center gap-3 py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100" />
          <div className="space-y-1">
            <div className="text-sm font-medium">Đang tải...</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              Vui lòng chờ một chút.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

