import React, { useState } from 'react';
import { Sparkles, Wand2, Users, Palette, Volume2 } from 'lucide-react';
import { StorySettings } from '../App';

interface StoryInputProps {
  onGenerate: (idea: string, settings: StorySettings) => void;
}

const genres = [
  'Fantasy', 'Sci-Fi', 'Mystery', 'Adventure', 'Romance', 
  'Horror', 'Comedy', 'Drama', 'Thriller', 'Historical'
];

const tones = [
  'Lighthearted', 'Dark', 'Epic', 'Mysterious', 'Romantic',
  'Comedic', 'Dramatic', 'Suspenseful', 'Inspiring', 'Melancholic'
];

const audiences = [
  'Children (5-8)', 'Kids (9-12)', 'Teens (13-17)', 
  'Young Adults (18-25)', 'Adults (25+)', 'All Ages'
];

function StoryInput({ onGenerate }: StoryInputProps) {
  const [idea, setIdea] = useState('');
  const [settings, setSettings] = useState<StorySettings>({
    genre: 'Fantasy',
    tone: 'Epic',
    audience: 'All Ages'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onGenerate(idea, settings);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Transform Ideas into Stories
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Enter your story idea and watch as AI creates a complete narrative with beautiful illustrations
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20">
        {/* Story Idea Input */}
        <div className="mb-8">
          <label htmlFor="story-idea" className="block text-white font-semibold mb-3">
            <div className="flex items-center space-x-2">
              <Wand2 className="w-5 h-5" />
              <span>Your Story Idea</span>
            </div>
          </label>
          <textarea
            id="story-idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="A young girl finds a secret door in her grandmother's attic..."
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 resize-none"
            required
          />
          <p className="text-white/60 text-sm mt-2">
            Describe your story idea in a sentence or short paragraph
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Genre Selection */}
          <div>
            <label className="block text-white font-semibold mb-3">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Genre</span>
              </div>
            </label>
            <select
              value={settings.genre}
              onChange={(e) => setSettings({ ...settings, genre: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-gray-800">
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-white font-semibold mb-3">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5" />
                <span>Tone</span>
              </div>
            </label>
            <select
              value={settings.tone}
              onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone} className="bg-gray-800">
                  {tone}
                </option>
              ))}
            </select>
          </div>

          {/* Audience Selection */}
          <div>
            <label className="block text-white font-semibold mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Audience</span>
              </div>
            </label>
            <select
              value={settings.audience}
              onChange={(e) => setSettings({ ...settings, audience: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
            >
              {audiences.map((audience) => (
                <option key={audience} value={audience} className="bg-gray-800">
                  {audience}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={!idea.trim()}
          className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-400/30"
        >
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Generate Story</span>
          </div>
        </button>
      </form>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 rounded-full mb-4">
            <Wand2 className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">AI-Generated Narrative</h3>
          <p className="text-white/70 text-sm">
            Advanced AI creates engaging, coherent stories tailored to your preferences
          </p>
        </div>
        
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="inline-flex items-center justify-center p-3 bg-pink-600/20 rounded-full mb-4">
            <Palette className="w-6 h-6 text-pink-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Custom Illustrations</h3>
          <p className="text-white/70 text-sm">
            Beautiful AI-generated images for each scene bring your story to life
          </p>
        </div>
        
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="inline-flex items-center justify-center p-3 bg-red-600/20 rounded-full mb-4">
            <Users className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Export & Share</h3>
          <p className="text-white/70 text-sm">
            Save as PDF or share your completed story with friends and family
          </p>
        </div>
      </div>
    </div>
  );
}

export default StoryInput;