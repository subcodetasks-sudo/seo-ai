import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-neutral-200">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-4 sm:px-5">
          <Skeleton className="mt-1.5 size-4 rounded-[4px]" />
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
