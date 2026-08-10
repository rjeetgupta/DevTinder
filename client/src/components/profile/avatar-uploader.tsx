"use client";

import { useRef, useState } from "react";
import { Camera, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUploader({
  initialsFallback,
  existingPhoto,
  onFileSelected,
}: {
  initialsFallback: string;
  existingPhoto?: string | null;
  onFileSelected: (file: File, previewUrl: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existingPhoto ?? null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Max 5MB allowed");
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid image format (use JPG, PNG, or WebP)");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelected(file, url);
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-white/15 bg-white/5 p-6">
      <div className="group relative">
        <Avatar className="ring-primary/50 size-24 ring-2 ring-offset-2 ring-offset-transparent">
          <AvatarImage src={preview ?? undefined} alt="Profile photo preview" />
          <AvatarFallback className="text-2xl">{initialsFallback}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Change photo"
        >
          <Camera className="size-5 text-white" />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="border-input hover:bg-accent inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
      >
        <UploadCloud className="size-4" /> Upload new photo
      </button>
      <p className="text-muted-foreground text-xs">Max 5MB (JPG, PNG, WebP)</p>
    </div>
  );
}
