import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  className?: string;
  fullPage?: boolean;
};

export default function LoadingState({ className, fullPage = true }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        fullPage && "flex-1 py-16",
        className,
      )}
    >
      <Spinner className="size-12 text-neutral-400" />
    </div>
  );
}
