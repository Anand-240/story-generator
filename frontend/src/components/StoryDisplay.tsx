import React, { useState, useRef } from 'react';
import { Story } from '../App';
import { Calendar, Tag, Users, BookOpen } from 'lucide-react';
import SceneCard from './SceneCard';

interface StoryDisplayProps {
  story: Story;
}

function StoryDisplay({ story }: StoryDisplayProps) {
  const [activeScene, setActiveScene] = useState<string | null>(null);
  const sceneRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToScene = (sceneId: string) => {
    const sceneElement = sceneRefs.current[sceneId];
    if (sceneElement) {
      sceneElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      setActiveScene(sceneId);
      // Clear the active scene after a few seconds
      setTimeout(() => setActiveScene(null), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Story Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Generated Story
            </h1>
            <p className="text-xl text-white/80 mb-4 italic">
              "{story.idea}"
            </p>
          </div>
          <div className="flex items-center space-x-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {story.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Story Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
            <Tag className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white/60 text-sm">Genre</p>
              <p className="text-white font-medium">{story.settings.genre}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
            <BookOpen className="w-5 h-5 text-pink-400" />
            <div>
              <p className="text-white/60 text-sm">Tone</p>
              <p className="text-white font-medium">{story.settings.tone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white/60 text-sm">Audience</p>
              <p className="text-white font-medium">{story.settings.audience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Progress */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Story Progress</h2>
          <span className="text-white/60">{story.scenes.length} Scenes</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {story.scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => scrollToScene(scene.id)}
              className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all duration-200 ${
                activeScene === scene.id
                  ? 'border-purple-400 bg-purple-600 text-white shadow-lg scale-110'
                  : 'border-white/30 bg-white/10 text-white/70 hover:border-purple-400/50 hover:bg-white/20 hover:scale-105'
              }`}
              title={`Go to ${scene.title}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Story Scenes */}
      <div className="space-y-8">
        {story.scenes.map((scene, index) => (
          <div
            key={scene.id}
            ref={(el) => (sceneRefs.current[scene.id] = el)}
            id={`scene-${scene.id}`}
          >
            <SceneCard
              scene={scene}
              sceneNumber={index + 1}
              isActive={activeScene === scene.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryDisplay;