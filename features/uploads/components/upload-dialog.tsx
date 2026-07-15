"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ImageIcon, UploadCloud, VideoIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createQueue, isSupportedMediaFile } from "@/features/uploads/services/queue";
import { uploadImageFile } from "@/features/uploads/services/image-upload";
import { uploadVideoFile } from "@/features/uploads/services/video-upload";
import type { UploadDialogProps, UploadItem } from "@/features/uploads/types/upload";

export function UploadDialog({
  imageUploadEndpoint = "/api/uploads/image",
  videoChunkEndpoint = "/api/uploads/video/chunk",
  videoMergeEndpoint = "/api/uploads/video/merge",
}: UploadDialogProps) {
  const t = useTranslations("uploads");
  const [open, setOpen] = useState(false);
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [filesById, setFilesById] = useState<Record<string, File>>({});
  const [previewById, setPreviewById] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const imageItems = useMemo(() => queue.filter((item) => item.kind === "image"), [queue]);
  const videoItems = useMemo(() => queue.filter((item) => item.kind === "video"), [queue]);

  function updateItem(id: string, patch: Partial<UploadItem>) {
    setQueue((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function onSelectFiles(fileList: FileList | null, kind: "image" | "video") {
    if (!fileList) {
      return;
    }

    const files = Array.from(fileList);
    const acceptedFiles = files.filter(
      (file) =>
        isSupportedMediaFile(file) &&
        (kind === "image" ? file.type.startsWith("image/") : file.type.startsWith("video/"))
    );
    const nextQueue = createQueue(acceptedFiles);
    const nextFilesById: Record<string, File> = {};
    const nextPreviewById: Record<string, string> = {};
    nextQueue.forEach((item, index) => {
      const file = acceptedFiles[index];
      nextFilesById[item.id] = file;
      nextPreviewById[item.id] = URL.createObjectURL(file);
    });

    setQueue((current) => [...current, ...nextQueue]);
    setFilesById((current) => ({ ...current, ...nextFilesById }));
    setPreviewById((current) => ({ ...current, ...nextPreviewById }));

    void autoUploadItems(nextQueue, nextFilesById);
  }

  async function uploadImage(item: UploadItem, file: File) {
    updateItem(item.id, { status: "processing", message: t("status.processing") });
    updateItem(item.id, { status: "uploading", progress: 35, message: t("status.uploadingImage") });
    await uploadImageFile(file, imageUploadEndpoint);
    updateItem(item.id, { status: "done", progress: 100, message: t("status.uploaded") });
  }

  async function uploadVideo(item: UploadItem, file: File) {
    updateItem(item.id, { status: "uploading", progress: 5, message: t("status.uploadingChunks") });
    await uploadVideoFile({
      file,
      videoChunkEndpoint,
      videoMergeEndpoint,
      onChunkUploaded: (chunkIndex, chunksTotal) => {
        const progress = Math.round(((chunkIndex + 1) / chunksTotal) * 90);
        updateItem(item.id, {
          progress,
          message: t("status.chunkProgress", { current: chunkIndex + 1, total: chunksTotal }),
        });
      },
    });

    updateItem(item.id, { status: "done", progress: 100, message: t("status.videoMerged") });
  }

  async function autoUploadItems(items: UploadItem[], fileMap: Record<string, File>) {
    setIsRunning(true);

    try {
      for (const item of items) {
        const file = fileMap[item.id];
        if (!file) {
          updateItem(item.id, { status: "error", message: t("status.missingFile") });
          continue;
        }

        try {
          if (item.kind === "image") {
            await uploadImage(item, file);
          } else {
            await uploadVideo(item, file);
          }
        } catch (error) {
          updateItem(item.id, {
            status: "error",
            message: error instanceof Error ? error.message : t("status.failedGeneric"),
          });
        }
      }
    } finally {
      setIsRunning(false);
    }
  }

  function removeItem(itemId: string) {
    const target = queue.find((item) => item.id === itemId);
    if (!target || target.status === "uploading" || target.status === "processing") {
      return;
    }

    setQueue((current) => current.filter((item) => item.id !== itemId));
    setFilesById((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    setPreviewById((current) => {
      const next = { ...current };
      const previewUrl = next[itemId];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      delete next[itemId];
      return next;
    });
  }

  function resetAll() {
    if (isRunning) {
      return;
    }
    setQueue([]);
    setFilesById({});
    Object.values(previewById).forEach((previewUrl) => {
      URL.revokeObjectURL(previewUrl);
    });
    setPreviewById({});
  }

  function closeDialog(nextOpen: boolean) {
    if (!nextOpen && !isRunning) {
      resetAll();
    }
    setOpen(nextOpen);
  }

  useEffect(() => {
    return () => {
      Object.values(previewById).forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [previewById]);

  function getStatusBadge(item: UploadItem) {
    if (item.status === "done") {
      return (
        <Badge variant="secondary" className="bg-emerald-600/90 text-white">
          <CheckCircle2 className="size-3" />
          {t("status.done")}
        </Badge>
      );
    }

    if (item.status === "error") {
      return (
        <Badge variant="destructive">
          <AlertCircle className="size-3" />
          {t("status.failed")}
        </Badge>
      );
    }

    if (item.status === "uploading" || item.status === "processing") {
      return <Badge variant="outline">{t("status.uploading")}</Badge>;
    }

    return <Badge variant="outline">{t("status.pending")}</Badge>;
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud />
          {t("trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Input
          ref={imageInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            onSelectFiles(event.target.files, "image");
            event.target.value = "";
          }}
        />
        <Input
          ref={videoInputRef}
          className="hidden"
          type="file"
          accept="video/*"
          multiple
          onChange={(event) => {
            onSelectFiles(event.target.files, "video");
            event.target.value = "";
          }}
        />

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "images" | "videos")}>
          <TabsList className="w-full">
            <TabsTrigger value="images">{t("tabs.images")}</TabsTrigger>
            <TabsTrigger value="videos">{t("tabs.videos")}</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="space-y-3">
            <div className="flex items-center justify-end gap-2 rounded-lg border border-dashed p-3">
              <Button variant="outline" onClick={() => imageInputRef.current?.click()} disabled={isRunning}>
                {t("addImages")}
              </Button>
            </div>
            <div className="max-h-112 overflow-y-auto rounded-lg border p-3">
              {imageItems.length === 0 ? (
                <p className="text-sm text-zinc-500">{t("empty")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {imageItems.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewById[item.id]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          size="icon-xs"
                          variant="secondary"
                          className="absolute top-2 end-2 bg-black/60 text-white hover:bg-black/80"
                          onClick={() => removeItem(item.id)}
                          disabled={item.status === "uploading" || item.status === "processing"}
                        >
                          <X className="size-3" />
                        </Button>
                        <div className="absolute top-2 start-2">
                          <Badge variant="outline" className="bg-black/60 text-white">
                            <ImageIcon className="size-3" />
                            {t("kind.image")}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 start-2">{getStatusBadge(item)}</div>
                      </div>
                      <div className="space-y-2 p-2.5">
                        <p className="truncate text-xs font-medium">{item.name}</p>
                        <Progress value={item.progress} />
                        <p className="truncate text-[11px] text-zinc-600 dark:text-zinc-400">
                          {item.message ?? item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-3">
            <div className="flex items-center justify-end gap-2 rounded-lg border border-dashed p-3">
              <Button variant="outline" onClick={() => videoInputRef.current?.click()} disabled={isRunning}>
                {t("addVideos")}
              </Button>
            </div>
            <div className="max-h-112 overflow-y-auto rounded-lg border p-3">
              {videoItems.length === 0 ? (
                <p className="text-sm text-zinc-500">{t("empty")}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {videoItems.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-900">
                        <video src={previewById[item.id]} className="h-full w-full object-cover" muted controls />
                        <Button
                          size="icon-xs"
                          variant="secondary"
                          className="absolute top-2 end-2 bg-black/60 text-white hover:bg-black/80"
                          onClick={() => removeItem(item.id)}
                          disabled={item.status === "uploading" || item.status === "processing"}
                        >
                          <X className="size-3" />
                        </Button>
                        <div className="absolute top-2 start-2">
                          <Badge variant="outline" className="bg-black/60 text-white">
                            <VideoIcon className="size-3" />
                            {t("kind.video")}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 start-2">{getStatusBadge(item)}</div>
                      </div>
                      <div className="space-y-2 p-2.5">
                        <p className="truncate text-xs font-medium">{item.name}</p>
                        <Progress value={item.progress} />
                        <p className="truncate text-[11px] text-zinc-600 dark:text-zinc-400">
                          {item.message ?? item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={resetAll} disabled={isRunning || queue.length === 0}>
            {t("clear")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
