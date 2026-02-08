'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DollarSign, Tag, MapPin, Image as ImageIcon, Save, X, Upload } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const DRAFT_STORAGE_KEY = 'listing_draft';

interface FormData {
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  isTrade: boolean;
  category: string;
  location: string;
  availableDate: string;
  isMoveOutBundle: boolean;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  isFree: false,
  isTrade: false,
  category: 'Dorm',
  location: 'Gage',
  availableDate: '',
  isMoveOutBundle: false,
};

export default function CreateListingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [hasDraft, setHasDraft] = useState(false);

  const categories = ['Dorm', 'Electronics', 'Textbooks', 'Furniture', 'Clothing', 'Appliances', 'Other'];
  const locations = ['Gage', 'Totem', 'Vanier', 'Orchard', 'Marine', 'Kitsilano', 'Thunderbird', 'Other'];

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft.formData || initialFormData);
        setImageUrls(draft.imageUrls || []);
        setHasDraft(true);
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  // Auto-save to localStorage
  const saveDraft = useCallback(() => {
    const draft = {
      formData,
      imageUrls,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    setHasDraft(true);
  }, [formData, imageUrls]);

  // Clear draft after successful submission
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
  }, []);

  // Auto-save when form data changes (debounced)
  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [formData, imageUrls, saveDraft]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        
        const data = await res.json();
        return data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      setImageUrls((prev) => [...prev, ...newUrls].slice(0, 5)); // Max 5 images
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image(s)');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrls.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.isFree || formData.isTrade ? null : parseFloat(formData.price),
          imageUrl: imageUrls[0], // Primary image
          imageUrls: imageUrls, // All images
        }),
      });

      if (res.ok) {
        clearDraft();
        router.push('/home');
      } else {
        alert('Failed to create listing');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="ubc-gradient p-4 rounded-2xl shadow-lg inline-block mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.webp"
                  alt="Exchangify Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-600">Please sign in to create a listing.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Draft saved indicator */}
      {hasDraft && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50">
          <Save className="h-4 w-4" />
          <span>Draft saved</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14">
              <Image
                src="/logo.webp"
                alt="Exchangify Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
              <p className="text-gray-500">List your item for fellow UBC students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-ubc-blue" />
              Images
            </h2>
            
            {imageUrls.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer inline-flex flex-col items-center">
                  <span className="text-primary font-semibold hover:underline">
                    Upload an image
                  </span>
                  <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={imageUrls[0]}
                    alt="Main image"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrls([])}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Thumbnails */}
                {imageUrls.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imageUrls.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const newUrls = [...imageUrls];
                          newUrls.splice(index, 1);
                          newUrls.unshift(url);
                          setImageUrls(newUrls);
                        }}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === 0 ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What are you selling?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your item in detail..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Pickup Location
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Pricing
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Price"
                    disabled={formData.isFree || formData.isTrade}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                  />
                </div>
                <label className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                  formData.isFree ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isFree: e.target.checked,
                      isTrade: false,
                      price: e.target.checked ? '' : formData.price
                    })}
                    className="sr-only"
                  />
                  <span className={formData.isFree ? 'text-green-600 font-medium' : 'text-gray-600'}>
                    Free
                  </span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-all ${
                  formData.isTrade ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={formData.isTrade}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isTrade: e.target.checked,
                      isFree: false,
                      price: e.target.checked ? '' : formData.price
                    })}
                    className="sr-only"
                  />
                  <span className={formData.isTrade ? 'text-purple-600 font-medium' : 'text-gray-600'}>
                    Trade
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
