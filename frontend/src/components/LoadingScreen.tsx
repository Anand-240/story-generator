import { useState, useEffect } from 'react';
import { Sparkles, Wand2, Palette, FileText } from 'lucide-react';

const loadingSteps = [
  { icon: FileText, text: 'Analyzing your story idea...', duration: 1000 },
  { icon: Wand2, text: 'Crafting 5-scene narrative structure...', duration: 1000 },
  { icon: Sparkles, text: 'Generating story scenes...', duration: 1500 },
  { icon: Palette, text: 'Creating images for all 5 scenes...', duration: 2000 }
];

function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100));
    }, 30);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 750);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full animate-pulse">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Creating Your Story
        </h2>
        <p className="text-white/70 mb-8">
          Generating a complete 5-scene story with automatic images for each scene
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm mt-2">{progress}% complete</p>
        </div>

        {/* Loading Steps */}
        <div className="space-y-4">
          {loadingSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-white/20 text-white transform scale-105' 
                    : isCompleted 
                    ? 'bg-white/5 text-white/80' 
                    : 'bg-white/5 text-white/40'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse' 
                    : isCompleted 
                    ? 'bg-green-600' 
                    : 'bg-white/10'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{step.text}</span>
                {isActive && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-white/60 text-sm">
          <p>✨ Creating 5 scenes with individual images</p>
          <p>This usually takes 2-3 minutes</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;