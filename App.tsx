import React, { useState } from 'react';
import { VisualHeader } from './components/VisualHeader';
import { StepPerson } from './components/StepPerson';
import { StepGarment } from './components/StepGarment';
import { StepResult } from './components/StepResult';
import { Gallery } from './components/Gallery';
import { AppStep, ImageAsset, HistoryItem } from './types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.PERSON);
  const [selectedPerson, setSelectedPerson] = useState<ImageAsset | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<ImageAsset | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handlePersonSelect = (asset: ImageAsset) => {
    setSelectedPerson(asset);
  };

  const handleGarmentSelect = (asset: ImageAsset) => {
    setSelectedGarment(asset);
  };

  const handleResultGenerated = (url: string) => {
    setResultImage(url);
    // Add to history
    if (selectedPerson && selectedGarment) {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        personUrl: selectedPerson.url,
        garmentUrl: selectedGarment.url,
        resultUrl: url,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev]);
    }
  };

  const handleNext = () => {
    if (step === AppStep.PERSON && selectedPerson) {
      setStep(AppStep.GARMENT);
    } else if (step === AppStep.GARMENT && selectedGarment) {
      setStep(AppStep.RESULT);
    }
  };

  const handleBack = () => {
    if (step === AppStep.GARMENT) {
      setStep(AppStep.PERSON);
    } else if (step === AppStep.RESULT) {
      setStep(AppStep.GARMENT);
      setResultImage(null); // Clear result when going back to prevent stale preview
    }
  };

  const handleReset = () => {
    setStep(AppStep.PERSON);
    setSelectedPerson(null);
    setSelectedGarment(null);
    setResultImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      {/* Header / Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-200">
              AI
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-600">
              梦幻衣橱
            </h1>
          </div>
          
          {step !== AppStep.RESULT && (
            <div className="text-sm text-gray-400 font-medium">
              Step {step} / 3
            </div>
          )}
        </div>
      </header>

      {/* Visual Progress */}
      <VisualHeader 
        person={selectedPerson} 
        garment={selectedGarment} 
        result={resultImage} 
        currentStep={step}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto pb-24">
        {step === AppStep.PERSON && (
          <StepPerson 
            selectedPerson={selectedPerson} 
            onSelect={handlePersonSelect} 
          />
        )}
        
        {step === AppStep.GARMENT && selectedPerson && (
          <StepGarment 
            selectedPerson={selectedPerson}
            selectedGarment={selectedGarment} 
            onSelect={handleGarmentSelect} 
          />
        )}

        {step === AppStep.RESULT && selectedPerson && selectedGarment && (
          <StepResult 
            person={selectedPerson}
            garment={selectedGarment}
            onResultGenerated={handleResultGenerated}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Floating Action Buttons for Navigation (Sticky at bottom center) */}
      {step !== AppStep.RESULT && (
        <div className="fixed bottom-6 left-0 w-full pointer-events-none flex justify-center z-40 px-4">
          <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-2 flex gap-4 pointer-events-auto">
            <button
              onClick={handleBack}
              disabled={step === AppStep.PERSON}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                step === AppStep.PERSON 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={18} />
              上一步
            </button>
            
            <button
              onClick={handleNext}
              disabled={(step === AppStep.PERSON && !selectedPerson) || (step === AppStep.GARMENT && !selectedGarment)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-purple-200 flex items-center gap-2 transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {step === AppStep.GARMENT ? '生成试穿' : '下一步'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* History Gallery */}
      <Gallery history={history} />
    </div>
  );
};

export default App;