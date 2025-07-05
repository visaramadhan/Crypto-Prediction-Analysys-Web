import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import ParameterConfiguration from './components/ParameterConfiguration';
import DataCollection from './components/DataCollection';
import DataPreprocessing from './components/DataPreprocessing';
import ModelTraining from './components/ModelTraining';
import ModelEvaluation from './components/ModelEvaluation';
import ResultsVisualization from './components/ResultsVisualization';
import ResultsStorage from './components/ResultsStorage';

function App() {
  const [currentStep, setCurrentStep] = useState('configuration');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [analysisParameters, setAnalysisParameters] = useState<any>(null);
  const [analysisResults, setAnalysisResults] = useState<any>({});
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);

  const steps = [
    {
      id: 'configuration',
      title: 'Parameter Configuration',
      status: currentStep === 'configuration' ? 'active' : 
             completedSteps.includes('configuration') ? 'completed' : 'pending',
      description: 'Konfigurasi parameter untuk data collection, preprocessing, dan model training'
    },
    {
      id: 'data-collection',
      title: 'Data Collection',
      status: currentStep === 'data-collection' ? 'active' : 
             completedSteps.includes('data-collection') ? 'completed' : 'pending',
      description: 'Mengumpulkan data dari CoinGecko API untuk Bitcoin, Ethereum, dan Solana'
    },
    {
      id: 'data-preprocessing',
      title: 'Data Preprocessing',
      status: currentStep === 'data-preprocessing' ? 'active' : 
             completedSteps.includes('data-preprocessing') ? 'completed' : 'pending',
      description: 'Normalisasi data dan penanganan missing values'
    },
    {
      id: 'model-training',
      title: 'Model Training',
      status: currentStep === 'model-training' ? 'active' : 
             completedSteps.includes('model-training') ? 'completed' : 'pending',
      description: 'Pelatihan model TFT, N-BEATS, dan DeepAR'
    },
    {
      id: 'model-evaluation',
      title: 'Model Evaluation',
      status: currentStep === 'model-evaluation' ? 'active' : 
             completedSteps.includes('model-evaluation') ? 'completed' : 'pending',
      description: 'Evaluasi dan perbandingan performa model'
    },
    {
      id: 'results-visualization',
      title: 'Results & Visualization',
      status: currentStep === 'results-visualization' ? 'active' : 
             completedSteps.includes('results-visualization') ? 'completed' : 'pending',
      description: 'Visualisasi hasil dan analisis komprehensif'
    }
  ];

  const handleStartAnalysis = (params: any) => {
    setAnalysisParameters(params);
    setIsAnalysisRunning(true);
    setCurrentStep('data-collection');
    setCompletedSteps(['configuration']);
  };

  const handleStepComplete = (stepId: string, data?: any) => {
    setAnalysisResults(prev => ({ ...prev, [stepId.replace('-', '')]: data }));
    setCompletedSteps(prev => [...prev, stepId]);
    
    const stepOrder = ['configuration', 'data-collection', 'data-preprocessing', 'model-training', 'model-evaluation', 'results-visualization'];
    const currentIndex = stepOrder.indexOf(stepId);
    const nextStep = stepOrder[currentIndex + 1];
    
    if (nextStep) {
      setTimeout(() => setCurrentStep(nextStep), 1000);
    } else {
      setIsAnalysisRunning(false);
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('configuration');
    setCompletedSteps([]);
    setAnalysisResults({});
    setAnalysisParameters(null);
    setIsAnalysisRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <StepIndicator steps={steps} currentStep={currentStep} />
            
            {/* Control Panel */}
            <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
              <h4 className="font-medium text-gray-800 mb-3">Control Panel</h4>
              <button
                onClick={resetAnalysis}
                disabled={isAnalysisRunning}
                className={`w-full py-2 px-4 rounded-lg transition-colors ${
                  isAnalysisRunning 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Reset Analysis
              </button>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2">Status: <span className="font-medium">{steps.find(s => s.id === currentStep)?.title}</span></p>
                <p>Completed: {completedSteps.length}/6 steps</p>
                {isAnalysisRunning && (
                  <div className="mt-2 flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                    Analysis Running...
                  </div>
                )}
              </div>
            </div>

            {/* Results Storage */}
            {Object.keys(analysisResults).length > 0 && (
              <div className="mt-6">
                <ResultsStorage results={analysisResults} parameters={analysisParameters} />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentStep === 'configuration' && (
              <ParameterConfiguration 
                onStartAnalysis={handleStartAnalysis}
                isAnalysisRunning={isAnalysisRunning}
              />
            )}
            
            <DataCollection 
              isActive={currentStep === 'data-collection'} 
              onComplete={(data) => handleStepComplete('data-collection', data)}
              parameters={analysisParameters}
            />
            
            <DataPreprocessing 
              isActive={currentStep === 'data-preprocessing'} 
              onComplete={(data) => handleStepComplete('data-preprocessing', data)}
              parameters={analysisParameters}
              inputData={analysisResults.datacollection}
            />
            
            <ModelTraining 
              isActive={currentStep === 'model-training'} 
              onComplete={(data) => handleStepComplete('model-training', data)}
              parameters={analysisParameters}
              inputData={analysisResults.datapreprocessing}
            />
            
            <ModelEvaluation 
              isActive={currentStep === 'model-evaluation'} 
              onComplete={(data) => handleStepComplete('model-evaluation', data)}
              parameters={analysisParameters}
              inputData={analysisResults.modeltraining}
            />
            
            <ResultsVisualization 
              isActive={currentStep === 'results-visualization'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;