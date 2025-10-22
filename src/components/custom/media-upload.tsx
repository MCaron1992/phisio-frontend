'use client';

import { useState, useRef, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import UniversalAlert from './UniversalAlert';
import { X } from 'lucide-react';

interface MediaUploadProps {
  type: 'image' | 'video';
  currentUrl?: string;
  onChange: (file: File | null) => void;
  label: string;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ type, currentUrl, onChange, label }) => {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alert, setAlert] = useState({
    show: false,
    type: 'error' as 'error',
    title: '',
    description: '',
  });

  const MAX_FILE_SIZE_MB = 5;

  const handleFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setAlert({
        show: true,
        type: 'error',
        title: 'File troppo grande',
        description: `Il file deve essere minore di ${MAX_FILE_SIZE_MB} MB`,
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) return;
    if (type === 'video' && !file.type.startsWith('video/')) return;
    handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>

      {preview ? (
        <div className="flex flex-col items-center gap-2">
          {type === 'image' ? (
            <div className="relative w-64 h-64 flex justify-center">
              <img src={preview} alt="Preview" className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="relative w-full h-64 flex justify-center">
              <video src={preview} controls className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (

        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-6 cursor-pointer transition
            ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 mb-3 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-gray-500 mt-2">Trascina o clicca per caricare</p>
        </div>
      )}

      <Input
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <UniversalAlert
        title={alert.title}
        description={alert.description}
        isVisible={alert.show}
        onClose={() => setAlert({ ...alert, show: false })}
        type={alert.type}
        duration={3000}
        position="top-right"
      />
    </div>
  );
};

export default MediaUpload;
