import React, { useRef, useState } from 'react';
import { Upload, FileVideo, AlertCircle, Loader2, Youtube, Link as LinkIcon } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isAnalyzing: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, onUrlSubmit, isAnalyzing }) => {
  const [activeMethod, setActiveMethod] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (activeMethod === 'upload') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (activeMethod === 'upload' && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert("Please upload a valid video file.");
      return;
    }
    // Simple client-side size check recommendation for the demo
    if (file.size > 50 * 1024 * 1024) {
      alert("For this demo, please use videos smaller than 50MB to ensure API processing limits are met.");
      return;
    }
    onUpload(file);
  };

  const handleUrlSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex gap-1">
          <button
            onClick={() => setActiveMethod('upload')}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeMethod === 'upload'
                ? 'bg-orange-50 text-orange-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
          <button
            onClick={() => setActiveMethod('url')}
            disabled={isAnalyzing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeMethod === 'url'
                ? 'bg-orange-50 text-orange-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Youtube className="w-4 h-4" />
            YouTube Link
          </button>
        </div>
      </div>

      {activeMethod === 'upload' ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-in-out text-center ${
            isDragging
              ? 'border-orange-500 bg-orange-50'
              : 'border-slate-300 hover:border-orange-400 bg-white'
          } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="video/*"
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-orange-100' : 'bg-slate-100'}`}>
              {isAnalyzing ? (
                <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
              ) : (
                <Upload className={`w-8 h-8 ${isDragging ? 'text-orange-600' : 'text-slate-400'}`} />
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-800">
                {isAnalyzing ? 'Analyzing your content...' : 'Upload your cooking video'}
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                Drag and drop your video here, or click to browse.
                <br />
                <span className="text-xs text-slate-400">Supported formats: MP4, MOV, WebM (Max 50MB)</span>
              </p>
            </div>

            {!isAnalyzing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
              >
                Select Video
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 md:p-12 text-center transition-all">
             <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-red-50 text-red-600">
                    {isAnalyzing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Youtube className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {isAnalyzing ? 'Analyzing video link...' : 'Paste YouTube Link'}
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-2">
                  We'll use Google Search to find the recipe and generate your strategy.
                </p>
                
                <form onSubmit={handleUrlSubmitInternal} className="w-full max-w-md mt-2 relative">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            required
                            disabled={isAnalyzing}
                        />
                    </div>
                    {!isAnalyzing && (
                        <button
                            type="submit"
                            className="mt-4 w-full px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                        >
                            Analyze Video <Youtube className="w-4 h-4" />
                        </button>
                    )}
                </form>
             </div>
        </div>
      )}
      
      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Tip:</strong> {activeMethod === 'upload' 
            ? "The AI extracts recipes directly from visuals and audio. Clear steps yield best results." 
            : "For YouTube links, we use Google Search grounding to find the recipe details and optimize content strategy."}
        </p>
      </div>
    </div>
  );
};

export default UploadSection;