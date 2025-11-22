import React, { useState, useRef } from 'react';
import { ImageAsset, PRESET_GARMENTS } from '../types';
import { Upload, CheckCircle, Sparkles, Loader2, Shirt } from 'lucide-react';
import { generateGarmentImage } from '../services/geminiService';

interface StepGarmentProps {
  selectedPerson: ImageAsset; // Passed to show context
  selectedGarment: ImageAsset | null;
  onSelect: (asset: ImageAsset) => void;
}

export const StepGarment: React.FC<StepGarmentProps> = ({ selectedPerson, selectedGarment, onSelect }) => {
  const [activeTab, setActiveTab] = useState<'select' | 'generate'>('select');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHistory, setGeneratedHistory] = useState<ImageAsset[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSelect({
        id: `upload-garment-${Date.now()}`,
        url,
        type: 'garment',
        description: '上传的衣物'
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const base64Image = await generateGarmentImage(prompt);
      // Note: generated image is base64 data URI
      const newGarment: ImageAsset = {
        id: `gen-${Date.now()}`,
        url: base64Image,
        type: 'garment',
        description: prompt
      };
      setGeneratedHistory(prev => [newGarment, ...prev]);
      onSelect(newGarment);
    } catch (error) {
      alert('生成衣物失败，请重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
        
        {/* Preview Context: Who are we dressing? */}
        <div className="hidden md:flex flex-col items-center flex-shrink-0 w-48 mb-6 md:mb-0 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">当前模特</span>
          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
            <img src={selectedPerson.url} alt="Selected Person" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="mt-3 text-xs text-gray-500 text-center px-2">
            已选择 {selectedPerson.description || '模特'}
          </div>
        </div>

        <div className="flex-1">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-2xl font-bold text-gray-800">第二步：挑选衣物</h2>
            <p className="text-gray-500 mt-1">从衣橱选择，上传图片，或让 AI 为你设计。</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-full sm:w-fit mx-auto md:mx-0">
            <button
              onClick={() => setActiveTab('select')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'select' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              选择/上传
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'generate' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles size={14} />
              AI 生成
            </button>
          </div>

          {activeTab === 'select' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
               {/* Upload Button */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 flex flex-col items-center justify-center cursor-pointer transition-all group"
              >
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-purple-100 transition-colors">
                  <Upload className="text-gray-500 group-hover:text-purple-600" size={24} />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600 group-hover:text-purple-700">上传衣物</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Generated History (if any) */}
              {generatedHistory.map((garment) => (
                <div
                  key={garment.id}
                  onClick={() => onSelect(garment)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group shadow-sm ${
                    selectedGarment?.id === garment.id ? 'ring-4 ring-purple-500 ring-offset-2' : ''
                  }`}
                >
                   <img src={garment.url} alt="Generated" className="w-full h-full object-cover" />
                   <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                     <Sparkles size={8} /> AI
                   </div>
                   {selectedGarment?.id === garment.id && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg">
                      <CheckCircle size={16} className="text-purple-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Presets */}
              {PRESET_GARMENTS.map((garment) => (
                <div
                  key={garment.id}
                  onClick={() => onSelect(garment)}
                  className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all ${
                    selectedGarment?.id === garment.id ? 'ring-4 ring-purple-500 ring-offset-2' : ''
                  }`}
                >
                  <img 
                    src={garment.url} 
                    alt={garment.description} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">{garment.description}</p>
                  </div>
                   {selectedGarment?.id === garment.id && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-lg">
                      <CheckCircle size={16} className="text-purple-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">描述你想穿的衣服</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一件复古的牛仔夹克，带有刺绣花纹..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      设计中...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      生成
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                提示：描述越具体，生成的效果越符合你的想象。Nano Banana 将为你定制专属服饰。
              </p>

              {/* Example Prompts */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">试试这些灵感</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['赛博朋克风格的发光夹克', '优雅的白色丝绸晚礼服', '90年代复古运动卫衣', '中国风刺绣旗袍'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setPrompt(tag)}
                      className="text-xs bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};