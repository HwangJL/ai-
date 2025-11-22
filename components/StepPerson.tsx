import React, { useRef } from 'react';
import { ImageAsset, PRESET_PEOPLE } from '../types';
import { Upload, CheckCircle } from 'lucide-react';

interface StepPersonProps {
  selectedPerson: ImageAsset | null;
  onSelect: (asset: ImageAsset) => void;
}

export const StepPerson: React.FC<StepPersonProps> = ({ selectedPerson, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSelect({
        id: `upload-${Date.now()}`,
        url,
        type: 'person',
        description: '上传的图片'
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">第一步：选择模特</h2>
        <p className="text-gray-500 mt-1">上传你自己的照片，或从下方选择一张预设模特。</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 flex flex-col items-center justify-center cursor-pointer transition-all group"
        >
          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-purple-100 transition-colors">
            <Upload className="text-gray-500 group-hover:text-purple-600" size={24} />
          </div>
          <span className="mt-2 text-sm font-medium text-gray-600 group-hover:text-purple-700">上传照片</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Presets */}
        {PRESET_PEOPLE.map((person) => (
          <div
            key={person.id}
            onClick={() => onSelect(person)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all ${
              selectedPerson?.id === person.id ? 'ring-4 ring-purple-500 ring-offset-2' : ''
            }`}
          >
            <img 
              src={person.url} 
              alt={person.description} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-xs font-medium truncate">{person.description}</p>
            </div>
            {selectedPerson?.id === person.id && (
              <div className="absolute top-2 right-2 bg-white rounded-full text-purple-600 p-1 shadow-lg">
                <CheckCircle size={16} fill="currentColor" className="text-purple-600 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};