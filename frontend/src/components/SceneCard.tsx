import React, { useState, useEffect } from 'react';
import { StoryScene } from '../App';
import { Edit3, RefreshCw, Image, Wand2, Loader, X, ZoomIn, Download } from 'lucide-react';
import { generateImage } from '../api.js';
import SimpleModal from './SimpleModal';

interface SceneCardProps {
  scene: StoryScene;
  sceneNumber: number;
  isActive: boolean;
}

function SceneCard({ scene, sceneNumber, isActive }: SceneCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(scene.text);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(scene.imageUrl || null);

  // Update imageUrl when scene.imageUrl changes
  useEffect(() => {
    if (scene.imageUrl) {
      setImageUrl(scene.imageUrl);
    }
  }, [scene.imageUrl]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageRetryCount, setImageRetryCount] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleSave = () => {
    // In a real app, this would update the scene in the parent state
    setIsEditing(false);
    console.log('Saving edited text:', editedText);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // Simulate regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRegenerating(false);
    console.log('Regenerating scene...');
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);

    try {
      const data = await generateImage(scene.imagePrompt, scene.id);
      setImageUrl(data.imageUrl);
      setImageRetryCount(0);
      console.log('Image generated successfully:', data);
    } catch (error) {
      console.error('Failed to generate image:', error);
      setImageError('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 ${
      isActive ? 'ring-2 ring-purple-400 shadow-2xl' : 'hover:bg-white/15'
    }`}>
      <div className="p-6 md:p-8">
        {/* Scene Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                {sceneNumber}
              </div>
              <h3 className="text-2xl font-bold text-white">{scene.title}</h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
              title="Edit scene"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
              title="Regenerate scene"
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Content */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full h-48 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 resize-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedText(scene.text);
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 leading-relaxed text-lg">
                  {scene.text}
                </p>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl border border-white/20 overflow-hidden">
              {imageUrl ? (
                <div className="relative w-full h-full cursor-pointer" onClick={() => setShowImageModal(true)}>
                  <img
                    src={imageUrl}
                    alt={scene.imagePrompt}
                    className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                    loading="lazy"
                    onLoad={() => setImageError(null)}
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl);
                      if (imageRetryCount < 2) {
                        setTimeout(() => {
                          setImageRetryCount(prev => prev + 1);
                          const retryUrl = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
                          e.target.src = retryUrl;
                        }, 1000);
                      } else {
                        setImageError('Failed to load image.');
                      }
                    }}
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
                    <div className="flex items-center space-x-2 text-white">
                      <ZoomIn className="w-5 h-5" />
                      <span className="text-sm font-medium">Click to view full size</span>
                    </div>
                  </div>
                </div>
              ) : isGeneratingImage ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-3">
                      <Loader className="w-8 h-8 text-white/70 animate-spin" />
                    </div>
                    <p className="text-white/70 mb-2">Generating Image...</p>
                    <p className="text-white/50 text-sm max-w-xs">
                      This may take a few seconds
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-white/30">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-3">
                      <Image className="w-8 h-8 text-white/70" />
                    </div>
                    <p className="text-white/70 mb-2">Image Generated Automatically</p>
                    <p className="text-white/50 text-sm max-w-xs">
                      Images are created automatically when the story is generated
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Error Message */}
            {imageError && (
              <div className="p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
                <p className="text-red-300 text-sm">{imageError}</p>
              </div>
            )}
            
            {/* Action Buttons - Only show regenerate if image exists */}
            {imageUrl && (
              <div className="flex space-x-2">
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span>Regenerate Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <SimpleModal 
        imageUrl={imageUrl}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        sceneTitle={scene.title}
        sceneNumber={sceneNumber}
      />
    </div>
  );
}

export default SceneCard;
