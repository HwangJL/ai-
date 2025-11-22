import React from 'react';
import { HistoryItem } from '../types';
import { Clock } from 'lucide-react';

interface GalleryProps {
  history: HistoryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full bg-white border-t border-gray-100 py-6 px-4 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4 text-gray-400">
          <Clock size={16} />
          <span className="text-xs font-semibold uppercase tracking-widest">历史记录</span>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {history.map((item) => (
            <div key={item.id} className="snap-start flex-shrink-0 w-24 h-32 sm:w-32 sm:h-44 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all relative group">
              <img src={item.resultUrl} alt="History" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={item.resultUrl} download className="text-white text-xs bg-white/20 backdrop-blur px-2 py-1 rounded">下载</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};