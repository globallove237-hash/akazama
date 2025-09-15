"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadImageToImgBB } from "@/actions/image-upload";
import { Upload, X, Loader2 } from "lucide-react";

export interface ImgBBData {
  id: string;
  title: string;
  url_viewer: string;
  url: string;
  display_url: string;
  width: string;
  height: string;
  size: string;
  time: string;
  expiration: string;
  image: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  thumb: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  medium: {
    filename: string;
    name: string;
    mime: string;
    extension: string;
    url: string;
  };
  delete_url: string;
}

interface ImageUploadProps {
  onImageUploadedAction: (
    imageUrl: string,
    imageData: ImgBBData | null,
  ) => void;
  currentImageUrl?: string;
  className?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  onImageUploadedAction,
  currentImageUrl,
  className = "",
  maxSize = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null,
  );
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`La taille du fichier ne doit pas dépasser ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image valide");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setPreviewUrl(base64);

        try {
          // Upload to ImgBB
          const result = await uploadImageToImgBB(base64, file.name);

          if (result.success && result.data) {
            onImageUploadedAction(result.data.url, result.data);
          } else {
            setError(result.error || "Erreur lors de l'upload");
            setPreviewUrl(currentImageUrl || null);
          }
        } catch (uploadError) {
          setError("Erreur lors de l'upload de l'image");
          setPreviewUrl(currentImageUrl || null);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError("Erreur lors de la lecture du fichier");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("Erreur lors du traitement du fichier");
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageUploadedAction("", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isUploading ? "border-amber-400 bg-amber-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"}
        `}
        onClick={!isUploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-amber-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Cliquez pour sélectionner une image
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF jusqu'à {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
