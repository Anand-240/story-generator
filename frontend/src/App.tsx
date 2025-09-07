import { useState } from 'react';
import { Sparkles, Book, Download, Share2 } from 'lucide-react';
import StoryInput from './components/StoryInput';
import StoryDisplay from './components/StoryDisplay';
import LoadingScreen from './components/LoadingScreen';

export interface StorySettings {
  genre: string;
  tone: string;
  audience: string;
}

export interface StoryScene {
  id: string;
  title: string;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface Story {
  id: string;
  idea: string;
  settings: StorySettings;
  scenes: StoryScene[];
  createdAt: Date;
}

function App() {
  const [currentView, setCurrentView] = useState<'input' | 'loading' | 'story'>('input');
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStoryGeneration = async (idea: string, settings: StorySettings) => {
    setIsGenerating(true);
    setCurrentView('loading');

    try {
      // Step 1: Generate the story
      const response = await fetch('https://story-generator-backend-ee1f.onrender.com/api/stories/generate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idea, settings })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const storyData = await response.json();
      
      // Step 2: Automatically generate images for all scenes
      console.log('Story generated, now generating images for all scenes...');
      const scenesWithImages = await Promise.all(
        storyData.scenes.map(async (scene: StoryScene) => {
          try {
            console.log(`Generating image for ${scene.title}...`);
            const imageResponse = await fetch('https://story-generator-backend-ee1f.onrender.com/api/stories/generate-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                imagePrompt: scene.imagePrompt,
                sceneId: scene.id
              })
            });
            
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              console.log(`✅ Image generated for ${scene.title}:`, imageData.imageUrl ? 'URL present' : 'No URL');
              return {
                ...scene,
                imageUrl: imageData.imageUrl
              };
            } else {
              console.warn(`❌ Failed to generate image for ${scene.title}:`, imageResponse.statusText);
              return scene; // Return scene without image if generation fails
            }
          } catch (imageError) {
            console.warn(`Image generation error for ${scene.title}:`, imageError);
            return scene; // Return scene without image if generation fails
          }
        })
      );

      // Convert the createdAt string to a Date object
      const story: Story = {
        ...storyData,
        scenes: scenesWithImages,
        createdAt: new Date(storyData.createdAt)
      };
      
      console.log('Story and images generated successfully!');
      console.log('Story object:', story);
      console.log('Scenes with images:', scenesWithImages);
      setCurrentStory(story);
      setCurrentView('story');
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert('Failed to generate story. Please try again.');
      setCurrentView('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewStory = () => {
    setCurrentStory(null);
    setCurrentView('input');
  };

  const handleExport = () => {
    console.log('Exporting story...');
    alert('Story export functionality would be implemented here!');
  };

  const handleShare = () => {
    console.log('Sharing story...');
    alert('Story sharing functionality would be implemented here!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="min-h-screen bg-black/20">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">StoryForge AI</h1>
                  <p className="text-white/70 text-sm">AI-Powered Storytelling</p>
                </div>
              </div>
              
              {currentStory && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={handleNewStory}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-200"
                  >
                    <Book className="w-4 h-4" />
                    <span>New Story</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'input' && (
            <StoryInput onGenerate={handleStoryGeneration} />
          )}
          
          {currentView === 'loading' && (
            <LoadingScreen />
          )}
          
          {currentView === 'story' && currentStory && (
            <StoryDisplay story={currentStory} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;