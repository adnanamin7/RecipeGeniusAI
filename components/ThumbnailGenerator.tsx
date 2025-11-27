import React, { useState } from 'react';
import { Image as ImageIcon, RefreshCw, Download, Sparkles } from 'lucide-react';
import { generateThumbnailImage } from '../services/geminiService';

interface ThumbnailGeneratorProps {
  prompt: string;
}

const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({ prompt }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const imageUrl = await generateThumbnailImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError("Failed to generate thumbnail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" />
          AI Thumbnail Generator
        </h3>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            AI Prompt (Editable)
          </label>
          <div className="p-3 bg-slate-50 text-slate-600 text-sm rounded-lg border border-slate-200 italic">
            "{prompt}"
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden group">
          {loading ? (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-600 animate-spin" />
              <span className="text-slate-500 font-medium">Cooking up a thumbnail...</span>
            </div>
          ) : generatedImage ? (
            <>
              <img 
                src={generatedImage} 
                alt="AI Generated Thumbnail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <a 
                  href={generatedImage} 
                  download="thumbnail.png"
                  className="p-3 bg-white rounded-full hover:bg-slate-100 transition-colors shadow-lg"
                  title="Download"
                >
                  <Download className="w-6 h-6 text-slate-800" />
                </a>
                <button 
                  onClick={handleGenerate}
                  className="p-3 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                  title="Regenerate"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">Ready to generate a high-performing thumbnail?</p>
              <button 
                onClick={handleGenerate}
                className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                Generate Thumbnail
              </button>
            </div>
          )}
          
          {error && !loading && (
             <div className="absolute bottom-4 left-4 right-4 bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-200 text-center">
               {error}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
