import React, { useState } from 'react';
import { ChefHat, Video, Wand2, ArrowRight } from 'lucide-react';
import UploadSection from './components/UploadSection';
import RecipeDisplay from './components/RecipeDisplay';
import StrategyDisplay from './components/StrategyDisplay';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import { AnalysisResult, AppState } from './types';
import { analyzeVideoContent, analyzeYoutubeUrl } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'recipe' | 'strategy' | 'thumbnail'>('recipe');

  const handleUpload = async (file: File) => {
    setAppState(AppState.ANALYZING);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        // Strip the data URL prefix (e.g., "data:video/mp4;base64,")
        const base64Content = base64Data.split(',')[1];
        
        try {
          const result = await analyzeVideoContent(base64Content, file.type);
          setAnalysisResult(result);
          setAppState(AppState.SUCCESS);
        } catch (error) {
          console.error(error);
          setAppState(AppState.ERROR);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const handleUrlSubmit = async (url: string) => {
    setAppState(AppState.ANALYZING);
    try {
      const result = await analyzeYoutubeUrl(url);
      setAnalysisResult(result);
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
    }
  };

  const renderContent = () => {
    if (!analysisResult) return null;

    switch (activeTab) {
      case 'recipe':
        return <RecipeDisplay recipe={analysisResult.recipe} />;
      case 'strategy':
        return <StrategyDisplay shorts={analysisResult.shortsStrategy} video={analysisResult.videoStrategy} />;
      case 'thumbnail':
        return <ThumbnailGenerator prompt={analysisResult.thumbnailPrompt} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
              <ChefHat className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">RecipeGenius<span className="text-orange-600">AI</span></h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro / Upload */}
        <div className={`transition-all duration-500 ${appState === AppState.SUCCESS ? 'mb-8' : 'min-h-[60vh] flex flex-col justify-center'}`}>
          <div className={`text-center mb-10 ${appState === AppState.SUCCESS ? 'hidden' : 'block'}`}>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Turn Cooking Videos into <br className="hidden sm:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Viral Recipes & Content</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload raw footage or paste a YouTube link. Get a structured recipe, viral Shorts scripts, optimized titles, and AI-generated thumbnails instantly.
            </p>
          </div>

          <UploadSection 
            onUpload={handleUpload} 
            onUrlSubmit={handleUrlSubmit}
            isAnalyzing={appState === AppState.ANALYZING} 
          />
          
          {appState === AppState.ERROR && (
            <div className="mt-6 mx-auto max-w-md bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
              Oops! Something went wrong analyzing the video. Please check the URL or try a shorter clip.
            </div>
          )}
        </div>

        {/* Results Area */}
        {appState === AppState.SUCCESS && analysisResult && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setActiveTab('recipe')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'recipe'
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <ChefHat className="w-4 h-4" />
                Recipe & Steps
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'strategy'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Video className="w-4 h-4" />
                Viral Strategy
              </button>
              <button
                onClick={() => setActiveTab('thumbnail')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'thumbnail'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Wand2 className="w-4 h-4" />
                Thumbnail
              </button>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto">
              {renderContent()}
            </div>
            
             <div className="text-center mt-12">
                <button 
                  onClick={() => {
                    setAppState(AppState.IDLE);
                    setAnalysisResult(null);
                  }}
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium"
                >
                  Process another video <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;