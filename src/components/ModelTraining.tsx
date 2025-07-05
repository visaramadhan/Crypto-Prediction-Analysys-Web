import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Activity, CheckCircle, TrendingUp } from 'lucide-react';

interface ModelTrainingProps {
  isActive: boolean;
  onComplete: (data: any) => void;
  parameters: any;
  inputData: any;
}

const ModelTraining: React.FC<ModelTrainingProps> = ({ 
  isActive, 
  onComplete, 
  parameters, 
  inputData 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentModel, setCurrentModel] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [modelStats, setModelStats] = useState<any>(null);
  const [trainingMetrics, setTrainingMetrics] = useState<any>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const models = [
    { name: 'Temporal Fusion Transformer (TFT)', key: 'tft', color: 'blue' },
    { name: 'N-BEATS', key: 'nbeats', color: 'green' },
    { name: 'DeepAR', key: 'deepar', color: 'purple' }
  ];

  const generateTrainingPhases = (modelName: string, epochs: number) => [
    `Initializing ${modelName} architecture...`,
    `Setting up hyperparameters for ${modelName}...`,
    `Loading training data for ${modelName}...`,
    ...Array.from({ length: epochs }, (_, i) => `Training ${modelName} epoch ${i + 1}/${epochs}...`),
    `Validating ${modelName} performance...`,
    `Saving ${modelName} model weights...`
  ];

  const generateFinalStats = () => {
    const totalDays = Math.ceil((new Date(parameters?.endDate || '2025-07-31').getTime() - 
                                new Date(parameters?.startDate || '2020-06-02').getTime()) / 
                               (1000 * 60 * 60 * 24));
    
    const trainDays = Math.floor(totalDays * (parameters?.trainSplit || 0.8));
    const valDays = Math.floor(totalDays * (parameters?.validationSplit || 0.1));
    const testDays = totalDays - trainDays - valDays;

    return {
      dataDistribution: {
        training: `${trainDays} days (${Math.round((parameters?.trainSplit || 0.8) * 100)}%)`,
        validation: `${valDays} days (${Math.round((parameters?.validationSplit || 0.1) * 100)}%)`,
        testing: `${testDays} days (${Math.round((parameters?.testSplit || 0.1) * 100)}%)`
      },
      hyperparameters: {
        learningRate: parameters?.tft?.learningRate || 0.001,
        batchSize: parameters?.tft?.batchSize || 64,
        epochs: parameters?.tft?.epochs || 10,
        optimizer: parameters?.tft?.optimizer || 'Adam'
      },
      trainingMetrics: {
        tft: { 
          trainLoss: 0.0234, 
          valLoss: 0.0289, 
          trainTime: `${Math.floor(Math.random() * 20) + 30}.${Math.floor(Math.random() * 9)} min`,
          finalEpoch: parameters?.tft?.epochs || 10
        },
        nbeats: { 
          trainLoss: 0.0267, 
          valLoss: 0.0312, 
          trainTime: `${Math.floor(Math.random() * 15) + 25}.${Math.floor(Math.random() * 9)} min`,
          finalEpoch: parameters?.nbeats?.epochs || 10
        },
        deepar: { 
          trainLoss: 0.0298, 
          valLoss: 0.0334, 
          trainTime: `${Math.floor(Math.random() * 18) + 28}.${Math.floor(Math.random() * 9)} min`,
          finalEpoch: parameters?.deepar?.epochs || 10
        }
      }
    };
  };

  useEffect(() => {
    if (!isActive || isCompleted) return;

    setProgress(0);
    setLogs([]);
    setCurrentModel('');
    setTrainingMetrics({});

    let currentModelIndex = 0;
    let currentPhaseIndex = 0;
    let allPhases: string[] = [];
    
    // Generate all training phases for all models
    models.forEach(model => {
      const epochs = parameters?.[model.key]?.epochs || 10;
      const phases = generateTrainingPhases(model.name, epochs);
      allPhases = [...allPhases, ...phases];
    });
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.3;
        const currentPhase = Math.floor(newProgress / (100 / allPhases.length));
        
        if (currentPhase < allPhases.length) {
          const phase = allPhases[currentPhase];
          
          // Determine current model
          let phaseCount = 0;
          let modelIndex = 0;
          for (let i = 0; i < models.length; i++) {
            const epochs = parameters?.[models[i].key]?.epochs || 10;
            const modelPhases = generateTrainingPhases(models[i].name, epochs);
            if (currentPhase < phaseCount + modelPhases.length) {
              modelIndex = i;
              break;
            }
            phaseCount += modelPhases.length;
          }
          
          setCurrentModel(models[modelIndex].name);
          setLogs(prevLogs => [...prevLogs.slice(-12), `${new Date().toLocaleTimeString()}: ${phase}`]);
          
          // Update training metrics progressively
          const epochMatch = phase.match(/epoch (\d+)\/(\d+)/);
          if (epochMatch) {
            const currentEpoch = parseInt(epochMatch[1]);
            const totalEpochs = parseInt(epochMatch[2]);
            const modelKey = models[modelIndex].key;
            
            setTrainingMetrics(prev => ({
              ...prev,
              [modelKey]: {
                currentEpoch,
                totalEpochs,
                trainLoss: (0.08 - (currentEpoch * 0.005)).toFixed(4),
                valLoss: (0.09 - (currentEpoch * 0.004)).toFixed(4),
                progress: (currentEpoch / totalEpochs) * 100
              }
            }));
          }
        }

        if (newProgress >= 100) {
          setCurrentModel('All models trained successfully!');
          const finalStats = generateFinalStats();
          setModelStats(finalStats);
          setIsCompleted(true);
          setTimeout(() => onComplete(finalStats), 1000);
          clearInterval(interval);
        }

        return Math.min(newProgress, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isActive, parameters]);

  if (!isActive && !isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Model Training
        </h3>
        <p className="text-gray-500">Waiting for activation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2" />
        Model Training
        {isCompleted && <CheckCircle className="w-5 h-5 ml-2 text-green-600" />}
      </h3>
      
      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Overall Progress</span>
            <span className="text-sm font-medium text-purple-600">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentModel}</p>
        </div>

        {/* Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model, index) => (
            <div key={model.key} className={`bg-${model.color}-50 rounded-lg p-4 border-2 ${
              currentModel.includes(model.name) ? `border-${model.color}-400` : `border-${model.color}-200`
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  currentModel.includes(model.name) ? `bg-${model.color}-500 animate-pulse` : `bg-${model.color}-300`
                }`} />
                <span className={`font-medium text-${model.color}-800 text-sm`}>{model.name}</span>
              </div>
              
              {/* Model-specific parameters */}
              <div className="text-xs text-gray-600 mb-2">
                <div>LR: {parameters?.[model.key]?.learningRate || 0.001}</div>
                <div>Batch: {parameters?.[model.key]?.batchSize || 64}</div>
                <div>Epochs: {parameters?.[model.key]?.epochs || 10}</div>
              </div>
              
              {trainingMetrics[model.key] && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Epoch:</span>
                    <span className="text-xs font-medium">
                      {trainingMetrics[model.key].currentEpoch}/{trainingMetrics[model.key].totalEpochs}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Train Loss:</span>
                    <span className="text-xs font-medium">{trainingMetrics[model.key].trainLoss}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Val Loss:</span>
                    <span className="text-xs font-medium">{trainingMetrics[model.key].valLoss}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className={`bg-${model.color}-500 h-1 rounded-full transition-all duration-300`}
                      style={{ width: `${trainingMetrics[model.key].progress || 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Training Configuration */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-3 flex items-center">
            <Cpu className="w-4 h-4 mr-2" />
            Training Configuration
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Data Split</div>
              <div className="font-medium text-purple-600">
                {Math.round((parameters?.trainSplit || 0.8) * 100)}% / {Math.round((parameters?.validationSplit || 0.1) * 100)}% / {Math.round((parameters?.testSplit || 0.1) * 100)}%
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Normalization</div>
              <div className="font-medium text-purple-600 capitalize">
                {parameters?.normalizationMethod || 'Min-Max'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Interpolation</div>
              <div className="font-medium text-purple-600 capitalize">
                {parameters?.interpolationMethod || 'Linear'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600">Cryptocurrencies</div>
              <div className="font-medium text-purple-600">
                {parameters?.cryptocurrencies?.length || 3}
              </div>
            </div>
          </div>
        </div>

        {/* Training Logs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Training Logs
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-600 font-mono">{log}</p>
            ))}
          </div>
        </div>

        {/* Final Statistics */}
        {modelStats && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Training Summary
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Data Distribution */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">Data Distribution</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Training:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {modelStats.dataDistribution.training}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Validation:</span>
                    <span className="text-sm font-medium text-orange-600">
                      {modelStats.dataDistribution.validation}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Testing:</span>
                    <span className="text-sm font-medium text-green-600">
                      {modelStats.dataDistribution.testing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Model Performance */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">Final Training Results</h5>
                <div className="space-y-2">
                  {Object.entries(modelStats.trainingMetrics).map(([key, metrics]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{key.toUpperCase()}:</span>
                      <span className="text-sm font-medium text-purple-600">
                        Loss: {metrics.trainLoss} | Time: {metrics.trainTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Model Files Generated */}
            <div className="mt-4 bg-white rounded-lg p-3 shadow-sm">
              <h5 className="font-medium text-gray-800 mb-2">Generated Model Files</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">tft_model.pt</div>
                <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">nbeats_model.pth</div>
                <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">deepar_model.npz</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelTraining;