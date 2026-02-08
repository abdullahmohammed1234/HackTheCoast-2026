'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Upload, Plus } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading?: boolean;
  maxImages?: number;
}

export default function ImageCarousel({
  images,
  onImagesChange,
  onUpload,
  uploading = false,
  maxImages = 5,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await onUpload(e);
      }
      // Reset input value to allow re-uploading same file
      e.target.value = '';
    },
    [onUpload]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden">
        {images.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <Upload className="h-12 w-12 mb-2" />
            <p className="text-sm">No images uploaded yet</p>
          </div>
        ) : (
          <>
            <div className="relative h-64">
              <img
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="w-full h-full object-contain bg-gray-900"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeImage(currentIndex)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentIndex
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload button */}
      {images.length < maxImages && (
        <label className="cursor-pointer">
          <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-gray-50 transition-colors">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                <span className="text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-gray-400" />
                <span className="text-gray-500 font-medium">
                  Add more images ({images.length}/{maxImages})
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}

// Simple single image uploader for compatibility
export function SingleImageUploader({
  imageUrl,
  onUpload,
  onRemove,
  uploading = false,
}: {
  imageUrl: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  uploading?: boolean;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-64 mx-auto rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div>
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <label className="cursor-pointer">
            <span className="text-primary font-semibold hover:underline">
              Upload an image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploading && <p className="text-gray-500 mt-2">Uploading...</p>}
        </div>
      )}
    </div>
  );
}
