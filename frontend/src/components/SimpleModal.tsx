import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface SimpleModalProps {
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  sceneTitle: string;
  sceneNumber: number;
}

export default function SimpleModal({ imageUrl, isOpen, onClose, sceneTitle, sceneNumber }: SimpleModalProps) {
  // ESC key support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `scene-${sceneNumber}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90"
      onClick={onClose}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/70 text-white rounded-full hover:bg-black/90"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-4 right-16 z-10 p-2 bg-black/70 text-white rounded-full hover:bg-black/90"
        >
          <Download className="w-6 h-6" />
        </button>
        
        {/* Image */}
        <div 
          className="relative max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={`${sceneTitle} - Scene ${sceneNumber}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            onError={(e) => {
              console.error('Failed to load image:', imageUrl);
            }}
          />
          
          {/* Scene info */}
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded">
            {sceneTitle} - Scene {sceneNumber}
          </div>
        </div>
      </div>
    </div>
  );
}
