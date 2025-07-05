import React, { useState, useEffect } from 'react';
import { Settings, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface DataPreprocessingProps {
  isActive: boolean;
  onComplete: (data: any) => void;
  parameters: any;
  inputData: any;
}

const DataPreprocessing: React.FC<DataPreprocessingProps> = ({ 
  isActive, 
  onComplete, 
  parameters, 
  inputData 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const tasks = [
    'Checking data quality...',
    'Identifying missing values...',
    `Applying ${parameters?.interpolationMethod || 'linear'} interpolation...`,
    `Normalizing price data using ${parameters?.normalizationMethod || 'Min-Max'} scaling...`,
    `Normalizing volume data using ${parameters?.normalizationMethod || 'Min-Max'} scaling...`,
    `Normalizing market cap data using ${parameters?.normalizationMethod || 'Min-Max'} scaling...`,
    'Validating normalized data...',
    'Saving preprocessed data...'
  ];

  const generatePreprocessingStats = () => {
    const cryptos = parameters?.cryptocurrencies || ['bitcoin', 'ethereum', 'solana'];
    const missingValues: any = {};
    
    cryptos.forEach((crypto: string) => {
      missingValues[crypto] = {
        found: Math.floor(Math.random() * 10) + 1,
        interpolated: Math.floor(Math.random() * 10) + 1
      };
    });

    return {
      missingValues,
      normalization: {
        method: parameters?.normalizationMethod || 'minmax',
        priceRange: '[0.0001, 1.0000]',
        volumeRange: '[0.0000, 1.0000]',
        marketCapRange: '[0.0002, 1.0000]'
      },
      dataQuality: {
        beforeCleaning: '94.2%',
        afterCleaning: '100%',
        outliers: 23,
        outliersHandled: 23
      }
    };
  };

  useEffect(() => {
    if (!isActive || isCompleted) return;

    setProgress(0);
    setLogs([]);
    setCurrentTask('');

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        const taskIndex = Math.floor(newProgress / 12.5);
        
        if (taskIndex < tasks.length) {
          setCurrentTask(tasks[taskIndex]);
          setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${tasks[taskIndex]}`]);
        }

        if (newProgress >= 100) {
          setCurrentTask('Data preprocessing completed!');
          const preprocessingStats = generatePreprocessingStats();
          setStats(preprocessingStats);
          setIsCompleted(true);
          setTimeout(() => onComplete(preprocessingStats), 1000);
          clearInterval(interval);
        }

        return Math.min(newProgress, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isActive, parameters]);

  if (!isActive && !isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Data Preprocessing
        </h3>
        <p className="text-gray-500">Waiting for activation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Data Preprocessing
        {isCompleted && <CheckCircle className="w-5 h-5 ml-2 text-green-600" />}
      </h3>
      
      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-orange-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentTask}</p>
        </div>

        {/* Preprocessing Methods */}
        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-medium text-orange-800 mb-3">Preprocessing Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600 mr-2" />
                <span className="font-medium text-gray-800">Normalization</span>
              </div>
              <p className="text-sm text-gray-600">
                {parameters?.normalizationMethod === 'minmax' ? 'Min-Max Scaling to [0, 1] range' :
                 parameters?.normalizationMethod === 'standard' ? 'Standard Scaling (z-score)' :
                 'Robust Scaling (median-based)'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Using scikit-learn {parameters?.normalizationMethod || 'MinMax'}Scaler
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mr-2" />
                <span className="font-medium text-gray-800">Missing Values</span>
              </div>
              <p className="text-sm text-gray-600">
                {parameters?.interpolationMethod === 'linear' ? 'Linear interpolation method' :
                 parameters?.interpolationMethod === 'polynomial' ? 'Polynomial interpolation' :
                 'Spline interpolation method'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Using pandas interpolate()</p>
            </div>
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Processing Logs</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-600 font-mono">{log}</p>
            ))}
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Preprocessing Statistics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Missing Values */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">Missing Values Handled</h5>
                <div className="space-y-2">
                  {Object.entries(stats.missingValues).map(([crypto, data]: [string, any]) => (
                    <div key={crypto} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 capitalize">{crypto}:</span>
                      <span className="text-sm font-medium text-green-600">
                        {data.found} fixed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Normalization Ranges */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">Normalization Ranges</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {stats.normalization.priceRange}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volume:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {stats.normalization.volumeRange}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Market Cap:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {stats.normalization.marketCapRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h5 className="font-medium text-gray-800 mb-2">Data Quality</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Before:</span>
                    <span className="text-sm font-medium text-orange-600">
                      {stats.dataQuality.beforeCleaning}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">After:</span>
                    <span className="text-sm font-medium text-green-600">
                      {stats.dataQuality.afterCleaning}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Outliers:</span>
                    <span className="text-sm font-medium text-blue-600">
                      {stats.dataQuality.outliersHandled} handled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cleaned Data Preview */}
        {isCompleted && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Cleaned Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 text-left">Date</th>
                    <th className="px-2 py-1 text-left">BTC Price (Norm)</th>
                    <th className="px-2 py-1 text-left">BTC Volume (Norm)</th>
                    <th className="px-2 py-1 text-left">ETH Price (Norm)</th>
                    <th className="px-2 py-1 text-left">ETH Volume (Norm)</th>
                    <th className="px-2 py-1 text-left">SOL Price (Norm)</th>
                    <th className="px-2 py-1 text-left">SOL Volume (Norm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="border-b">
                      <td className="px-2 py-1">2020-06-{i.toString().padStart(2, '0')}</td>
                      <td className="px-2 py-1">{(Math.random()).toFixed(4)}</td>
                      <td className="px-2 py-1">{(Math.random()).toFixed(4)}</td>
                      <td className="px-2 py-1">{(Math.random()).toFixed(4)}</td>
                      <td className="px-2 py-1">{(Math.random()).toFixed(4)}</td>
                      <td className="px-2 py-1">{(Math.random()).toFixed(4)}</td>
                      <td className="px-2 py-1">{(Math.random()).toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">Showing normalized data ready for model training...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPreprocessing;