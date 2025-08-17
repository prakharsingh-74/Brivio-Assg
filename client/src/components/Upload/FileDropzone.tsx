import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { HiArrowUpTray } from 'react-icons/hi2';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  accept?: string;
}

export function FileDropzone({ onFileSelect, disabled = false, accept = ".mp3" }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const isValidMime = file.type === 'audio/mpeg' || file.type === 'audio/mp3';
    const isValidExtension = file.name.toLowerCase().endsWith('.mp3');
    
    return isValidMime && isValidExtension;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      alert('Please select a valid MP3 file.');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className={`relative w-full max-w-lg p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Click to upload MP3 file or drag and drop"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className={`${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
          <HiArrowUpTray className="w-8 h-8 mx-auto mb-4" />
          <p className="text-base font-medium mb-1">Upload</p>
          <p className="text-sm">Click to browse or drag and drop your MP3 file here</p>
        </div>
      </div>
    </div>
  );
}