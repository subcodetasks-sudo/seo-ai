import LoadingState from "@/components/loading-state";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <LoadingState />
    </div>
  );
}
