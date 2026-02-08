'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarUpdate: (newAvatar: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: { container: 'w-16 h-16', icon: 'w-6 h-6', button: 'w-6 h-6' },
  md: { container: 'w-24 h-24', icon: 'w-10 h-10', button: 'w-8 h-8' },
  lg: { container: 'w-32 h-32', icon: 'w-14 h-14', button: 'w-10 h-10' },
  xl: { container: 'w-40 h-40', icon: 'w-18 h-18', button: 'w-12 h-12' },
};

export default function AvatarUpload({ 
  currentAvatar, 
  onAvatarUpdate,
  size = 'lg'
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setPreview(base64);
      await uploadAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (base64Image: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: base64Image }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload avatar');
      }

      const data = await response.json();
      onAvatarUpdate(data.avatar);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
      setPreview(currentAvatar || null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!preview) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove avatar');
      }

      setPreview(null);
      onAvatarUpdate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const sizes = sizeClasses[size];

  return (
    <div className="relative">
      <div 
        className={`${sizes.container} rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative z-0`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <User className={`${sizes.icon} text-gray-400`} />
          </div>
        )}
        
        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      {/* Camera/Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`absolute bottom-0 right-0 ${sizes.button} bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-700 transition-colors z-20 border-2 border-white`}
        disabled={isUploading}
      >
        <Camera className="w-1/2 h-1/2" />
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Remove button (only if avatar exists) */}
      {preview && !isUploading && (
        <button
          onClick={removeAvatar}
          className="absolute -top-1 -left-1 bg-red-500 rounded-full p-1 text-white shadow-lg hover:bg-red-600 transition-colors"
          title="Remove avatar"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
