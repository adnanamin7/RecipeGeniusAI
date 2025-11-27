import React from 'react';
import { ShortsStrategy, VideoStrategy } from '../types';
import { Youtube, Hash, TrendingUp, Video, FileText, Target } from 'lucide-react';

interface StrategyDisplayProps {
  shorts: ShortsStrategy;
  video: VideoStrategy;
}

const StrategyDisplay: React.FC<StrategyDisplayProps> = ({ shorts, video }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Shorts Strategy */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-bold">Viral Shorts Strategy</h3>
        </div>
        
        <div className="p-6 space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">The Hook (First 3s)</h4>
            <div className="p-3 bg-red-50 text-red-900 rounded-lg border border-red-100 font-medium">
              "{shorts.hook}"
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visual Script</h4>
            <div className="prose prose-sm prose-slate max-w-none bg-slate-50 p-4 rounded-lg border border-slate-100">
               <p className="whitespace-pre-wrap">{shorts.script}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Editing Cues</h4>
               <ul className="space-y-2">
                 {shorts.visualCues.map((cue, i) => (
                   <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                     <Target className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                     {cue}
                   </li>
                 ))}
               </ul>
            </div>
            <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hashtags</h4>
               <div className="flex flex-wrap gap-2">
                 {shorts.hashtags.map((tag, i) => (
                   <span key={i} className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-1 rounded-md">
                     {tag.startsWith('#') ? tag : `#${tag}`}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Long Video Strategy */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        <div className="p-4 bg-slate-800 text-white flex items-center gap-2">
          <Youtube className="w-5 h-5" />
          <h3 className="font-bold">Long-Form Optimization</h3>
        </div>
        
        <div className="p-6 space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title Ideas</h4>
            <ul className="space-y-2">
              {video.titleOptions.map((title, i) => (
                <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold group-hover:bg-slate-300">
                    {i + 1}
                  </span>
                  <span className="text-slate-800 font-medium text-sm">{title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Structure</h4>
             <div className="space-y-3">
               <div className="flex gap-3">
                 <div className="w-16 shrink-0 text-xs font-semibold text-slate-500 text-right">Intro</div>
                 <div className="text-sm text-slate-700">{video.structure.intro}</div>
               </div>
               <div className="flex gap-3">
                 <div className="w-16 shrink-0 text-xs font-semibold text-slate-500 text-right">Body</div>
                 <div className="text-sm text-slate-700">{video.structure.body}</div>
               </div>
               <div className="flex gap-3">
                 <div className="w-16 shrink-0 text-xs font-semibold text-slate-500 text-right">Outro</div>
                 <div className="text-sm text-slate-700">{video.structure.conclusion}</div>
               </div>
             </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Thumbnail Text</h4>
            <div className="bg-slate-900 text-white px-4 py-3 rounded-lg text-center font-black text-xl tracking-tight shadow-lg">
              {video.thumbnailText}
            </div>
          </div>

           <div>
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SEO Keywords</h4>
               <div className="flex flex-wrap gap-1.5">
                 {video.seoKeywords.map((kw, i) => (
                   <span key={i} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                     {kw}
                   </span>
                 ))}
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDisplay;
