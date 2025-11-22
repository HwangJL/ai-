import React, { useEffect, useState } from 'react';
import { ImageAsset } from '../types';
import { generateTryOnImage, urlToBase64 } from '../services/geminiService';
import { Loader2, Download, RefreshCw, Share2 } from 'lucide-react';

interface StepResultProps {
  person: ImageAsset;
  garment: ImageAsset;
  onResultGenerated: (url: string) => void;
  onReset: () => void;
}

export const StepResult: React.FC<StepResultProps> = ({ person, garment, onResultGenerated, onReset }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const processGeneration = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert URLs to Base64 if they aren't already (data URIs)
        const personB64 = person.url.startsWith('data:') 
          ? person.url.split(',')[1] 
          : await urlToBase64(person.url);
          
        const garmentB64 = garment.url.startsWith('data:') 
          ? garment.url.split(',')[1] 
          : await urlToBase64(garment.url);

        if (!mounted) return;

        const resultB64 = await generateTryOnImage(personB64, garmentB64);
        
        if (mounted) {
          setGeneratedUrl(resultB64);
          onResultGenerated(resultB64);
        }
      } catch (err) {
        if (mounted) {
          setError('生成试穿效果失败，请稍后再试或更换图片。');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    processGeneration();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center animate-fade-in">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <RefreshCw size={20} className="text-purple-600 animate-pulse" />
          </div>
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-800">正在施展换装魔法...</h3>
        <p className="text-gray-500 mt-2">Nano Banana 正在为你生成全身试穿效果</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <RefreshCw size={32} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">出错了</h3>
        <p className="text-gray-500 max-w-md mb-6">{error}</p>
        <button 
          onClick={onReset}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          重新开始
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">试穿完成！</h2>
        <p className="text-gray-500 mt-1">这是为你定制的专属造型。</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Result Image */}
        <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200 group">
          {generatedUrl && <img src={generatedUrl} alt="Try On Result" className="w-full h-full object-cover" />}
           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a 
            href={generatedUrl || '#'} 
            download={`ai-wardrobe-${Date.now()}.png`}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5"
          >
            <Download size={20} />
            保存图片
          </a>
          
          <button 
            onClick={() => alert("分享功能即将上线！")}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <Share2 size={20} />
            分享给朋友
          </button>

          <div className="my-2 border-t border-gray-100"></div>

          <button 
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-purple-600 px-6 py-2 rounded-xl font-medium transition-colors"
          >
            <RefreshCw size={16} />
            再试一次
          </button>
        </div>
      </div>
    </div>
  );
};