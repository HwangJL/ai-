import React from 'react';
import { ImageAsset, AppStep } from '../types';
import { User, Shirt, Wand2 } from 'lucide-react';

interface VisualHeaderProps {
  person: ImageAsset | null;
  garment: ImageAsset | null;
  result: string | null;
  currentStep: AppStep;
}

const CardPreview: React.FC<{
  image: string | null;
  fallbackIcon: React.ReactNode;
  label: string;
  active: boolean;
  rotateClass: string;
  zIndex: string;
}> = ({ image, fallbackIcon, label, active, rotateClass, zIndex }) => (
  <div
    className={`relative w-28 h-40 sm:w-36 sm:h-52 rounded-2xl shadow-xl transition-all duration-500 ease-out transform ${rotateClass} ${zIndex} ${
      active ? 'scale-110 ring-4 ring-purple-400' : 'scale-100 opacity-80 hover:opacity-100'
    } bg-white border-2 border-gray-100 overflow-hidden flex flex-col items-center justify-center`}
  >
    {image ? (
      <img src={image} alt={label} className="w-full h-full object-cover" />
    ) : (
      <div className="flex flex-col items-center justify-center text-gray-300">
        {fallbackIcon}
        <span className="text-xs mt-2 font-medium">{label}</span>
      </div>
    )}
    
    {/* Glassmorphism Label Overlay */}
    <div className="absolute bottom-0 w-full bg-white/70 backdrop-blur-md py-1 text-center">
      <span className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
        {label}
      </span>
    </div>
  </div>
);

export const VisualHeader: React.FC<VisualHeaderProps> = ({ person, garment, result, currentStep }) => {
  return (
    <div className="w-full py-8 sm:py-12 flex justify-center items-center bg-gradient-to-b from-purple-50 to-slate-50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative flex items-center space-x-[-20px] sm:space-x-[-30px] mt-4">
        <CardPreview
          image={person?.url || null}
          fallbackIcon={<User size={32} />}
          label="人物"
          active={currentStep === AppStep.PERSON}
          rotateClass="-rotate-6 translate-y-2"
          zIndex="z-10"
        />
        <CardPreview
          image={garment?.url || null}
          fallbackIcon={<Shirt size={32} />}
          label="衣物"
          active={currentStep === AppStep.GARMENT}
          rotateClass="rotate-0 -translate-y-2"
          zIndex="z-20"
        />
        <CardPreview
          image={result}
          fallbackIcon={<Wand2 size={32} />}
          label="效果"
          active={currentStep === AppStep.RESULT}
          rotateClass="rotate-6 translate-y-2"
          zIndex="z-10"
        />
      </div>
    </div>
  );
};