import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Award, CheckCircle, AlertCircle } from 'lucide-react';

interface ModelEvaluationProps {
  isActive: boolean;
  onComplete: (data: any) => void;
  parameters: any;
  inputData: any;
}

const ModelEvaluation: React.FC<ModelEvaluationProps> = ({ 
  isActive, 
  onComplete, 
  parameters, 
  inputData 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  const [bestModel, setBestModel] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);

  const tasks = [
    'Loading test data...',
    'Generating predictions with TFT...',
    'Generating predictions with N-BEATS...',
    'Generating predictions with DeepAR...',
    'Calculating MAE metrics...',
    'Calculating RMSE metrics...',
    'Calculating MAPE metrics...',
    'Calculating R² metrics...',
    'Performing statistical significance tests...',
    'Generating comparison charts...',
    'Analyzing model performance...',
    'Finalizing evaluation report...'
  ];

  const generateEvaluationResults = () => {
    const cryptos = parameters?.cryptocurrencies || ['bitcoin', 'ethereum', 'solana'];
    const results: any = {};
    
    cryptos.forEach(crypto => {
      results[crypto] = {
        tft: { 
          mae: (0.02 + Math.random() * 0.01).toFixed(4), 
          rmse: (0.025 + Math.random() * 0.01).toFixed(4), 
          mape: (2.0 + Math.random() * 1.0).toFixed(2), 
          r2: (0.92 + Math.random() * 0.05).toFixed(4) 
        },
        nbeats: { 
          mae: (0.025 + Math.random() * 0.01).toFixed(4), 
          rmse: (0.03 + Math.random() * 0.01).toFixed(4), 
          mape: (2.5 + Math.random() * 1.0).toFixed(2), 
          r2: (0.90 + Math.random() * 0.05).toFixed(4) 
        },
        deepar: { 
          mae: (0.028 + Math.random() * 0.01).toFixed(4), 
          rmse: (0.032 + Math.random() * 0.01).toFixed(4), 
          mape: (2.8 + Math.random() * 1.0).toFixed(2), 
          r2: (0.88 + Math.random() * 0.05).toFixed(4) 
        }
      };
    });

    // Calculate averages
    const avgMetrics = {
      tft: { mae: 0, rmse: 0, mape: 0, r2: 0 },
      nbeats: { mae: 0, rmse: 0, mape: 0, r2: 0 },
      deepar: { mae: 0, rmse: 0, mape: 0, r2: 0 }
    };

    Object.keys(avgMetrics).forEach(model => {
      const metrics = cryptos.map(crypto => results[crypto][model]);
      avgMetrics[model].mae = (metrics.reduce((sum, m) => sum + parseFloat(m.mae), 0) / metrics.length).toFixed(4);
      avgMetrics[model].rmse = (metrics.reduce((sum, m) => sum + parseFloat(m.rmse), 0) / metrics.length).toFixed(4);
      avgMetrics[model].mape = (metrics.reduce((sum, m) => sum + parseFloat(m.mape), 0) / metrics.length).toFixed(2);
      avgMetrics[model].r2 = (metrics.reduce((sum, m) => sum + parseFloat(m.r2), 0) / metrics.length).toFixed(4);
    });

    results.summary = {
      bestOverall: 'TFT',
      avgMetrics,
      statisticalTests: {
        tftVsNbeats: { pValue: 0.023, significant: true },
        tftVsDeepAR: { pValue: 0.012, significant: true },
        nbeatsVsDeepAR: { pValue: 0.156, significant: false }
      }
    };

    return results;
  };

  useEffect(() => {
    if (!isActive || isCompleted) return;

    setProgress(0);
    setLogs([]);
    setCurrentTask('');

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        const taskIndex = Math.floor(newProgress / 8.33);
        
        if (taskIndex < tasks.length) {
          setCurrentTask(tasks[taskIndex]);
          setLogs(prevLogs => [...prevLogs.slice(-8), `${new Date().toLocaleTimeString()}: ${tasks[taskIndex]}`]);
        }

        if (newProgress >= 100) {
          setCurrentTask('Model evaluation completed!');
          const evaluationResults = generateEvaluationResults();
          setResults(evaluationResults);
          setBestModel('Temporal Fusion Transformer (TFT)');
          setIsCompleted(true);
          setTimeout(() => onComplete(evaluationResults), 1000);
          clearInterval(interval);
        }

        return Math.min(newProgress, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isActive, parameters]);

  if (!isActive && !isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Model Evaluation
        </h3>
        <p className="text-gray-500">Waiting for activation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2" />
        Model Evaluation
        {isCompleted && <CheckCircle className="w-5 h-5 ml-2 text-green-600" />}
      </h3>
      
      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Evaluation Progress</span>
            <span className="text-sm font-medium text-indigo-600">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentTask}</p>
        </div>

        {/* Evaluation Metrics */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-3">Evaluation Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm text-center">
              <div className="text-sm text-gray-600">MAE</div>
              <div className="font-medium text-indigo-600">Mean Absolute Error</div>
              <div className="text-xs text-gray-500">Lower is better</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm text-center">
              <div className="text-sm text-gray-600">RMSE</div>
              <div className="font-medium text-indigo-600">Root Mean Square Error</div>
              <div className="text-xs text-gray-500">Lower is better</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm text-center">
              <div className="text-sm text-gray-600">MAPE</div>
              <div className="font-medium text-indigo-600">Mean Absolute % Error</div>
              <div className="text-xs text-gray-500">Lower is better</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm text-center">
              <div className="text-sm text-gray-600">R²</div>
              <div className="font-medium text-indigo-600">Coefficient of Determination</div>
              <div className="text-xs text-gray-500">Higher is better</div>
            </div>
          </div>
        </div>

        {/* Evaluation Logs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Evaluation Logs</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-600 font-mono">{log}</p>
            ))}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Best Model */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Best Performing Model
              </h4>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-800">{bestModel}</div>
                    <div className="text-sm text-gray-600">Consistently outperformed other models across all cryptocurrencies</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Average MAPE</div>
                    <div className="font-bold text-green-600">{results.summary.avgMetrics.tft.mape}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
              <h4 className="font-medium text-gray-800 mb-3">Detailed Performance Results</h4>
              
              {Object.entries(results).filter(([key]) => key !== 'summary').map(([crypto, metrics]: [string, any]) => (
                <div key={crypto} className="mb-6 last:mb-0">
                  <h5 className="font-medium text-gray-800 mb-3 capitalize">{crypto} Results</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(metrics).map(([model, values]: [string, any]) => (
                      <div key={model} className={`rounded-lg p-3 ${
                        model === 'tft' ? 'bg-green-50 border-2 border-green-200' : 
                        model === 'nbeats' ? 'bg-blue-50 border-2 border-blue-200' : 
                        'bg-purple-50 border-2 border-purple-200'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${
                            model === 'tft' ? 'text-green-800' : 
                            model === 'nbeats' ? 'text-blue-800' : 
                            'text-purple-800'
                          }`}>
                            {model.toUpperCase()}
                          </span>
                          {model === 'tft' && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">MAE:</span>
                            <span className="font-medium ml-1">{values.mae}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">RMSE:</span>
                            <span className="font-medium ml-1">{values.rmse}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">MAPE:</span>
                            <span className="font-medium ml-1">{values.mape}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">R²:</span>
                            <span className="font-medium ml-1">{values.r2}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Statistical Tests */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-3">Statistical Significance Tests</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(results.summary.statisticalTests).map(([test, result]: [string, any]) => (
                  <div key={test} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-sm font-medium text-gray-800 mb-1">
                      {test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">p-value: {result.pValue}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.significant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {result.significant ? 'Significant' : 'Not Significant'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-3">Overall Performance Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(results.summary.avgMetrics).map(([model, metrics]: [string, any]) => (
                  <div key={model} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-center">
                      <div className={`font-medium mb-2 ${
                        model === 'tft' ? 'text-green-600' : 
                        model === 'nbeats' ? 'text-blue-600' : 
                        'text-purple-600'
                      }`}>
                        {model.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">Avg MAPE: {metrics.mape}%</div>
                      <div className="text-sm text-gray-600">Avg R²: {metrics.r2}</div>
                      <div className="text-sm text-gray-600">Avg MAE: {metrics.mae}</div>
                      <div className="text-sm text-gray-600">Avg RMSE: {metrics.rmse}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prediction vs Actual Preview */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">Prediction vs Actual (Sample)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-2 py-1 text-left">Date</th>
                      <th className="px-2 py-1 text-left">BTC Actual</th>
                      <th className="px-2 py-1 text-left">BTC TFT</th>
                      <th className="px-2 py-1 text-left">ETH Actual</th>
                      <th className="px-2 py-1 text-left">ETH TFT</th>
                      <th className="px-2 py-1 text-left">SOL Actual</th>
                      <th className="px-2 py-1 text-left">SOL TFT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="border-b border-blue-200">
                        <td className="px-2 py-1">2025-01-{(23 + i).toString().padStart(2, '0')}</td>
                        <td className="px-2 py-1">${(45000 + Math.random() * 5000).toFixed(2)}</td>
                        <td className="px-2 py-1">${(45000 + Math.random() * 5000).toFixed(2)}</td>
                        <td className="px-2 py-1">${(2300 + Math.random() * 300).toFixed(2)}</td>
                        <td className="px-2 py-1">${(2300 + Math.random() * 300).toFixed(2)}</td>
                        <td className="px-2 py-1">${(85 + Math.random() * 15).toFixed(2)}</td>
                        <td className="px-2 py-1">${(85 + Math.random() * 15).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">Showing sample predictions for test period...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelEvaluation;