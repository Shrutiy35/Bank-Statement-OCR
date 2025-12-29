
import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { ImageIcon } from './icons/ImageIcon';
import { PdfIcon } from './icons/PdfIcon';
import { FileIcon } from './icons/FileIcon';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selectedFile: File) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type === 'application/pdf')) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    } else {
      alert('Please upload a valid image or PDF file.');
    }
  }, [onFileChange]);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const renderFilePreview = () => {
    if (!file) return null;
    
    let icon;
    if (file.type.startsWith('image/')) {
      icon = <ImageIcon />;
    } else if (file.type === 'application/pdf') {
      icon = <PdfIcon />;
    } else {
      icon = <FileIcon />;
    }

    return (
      <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-xs">{file.name}</span>
        </div>
        <button 
          onClick={() => {
            setFile(null);
            onFileChange(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="text-red-500 hover:text-red-700 font-bold"
        >
          &times;
        </button>
      </div>
    );
  };
  
  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
        ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*,application/pdf" 
        className="hidden" 
      />
      {file ? (
        renderFilePreview()
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <UploadIcon />
          <p className="text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">PDF, PNG, JPG, or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
