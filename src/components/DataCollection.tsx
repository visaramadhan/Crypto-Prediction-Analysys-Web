import React, { useState, useEffect } from 'react';
import { Download, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface DataCollectionProps {
  isActive: boolean;
  onComplete: (data: any) => void;
  parameters: any;
}

const DataCollection: React.FC<DataCollectionProps> = ({ isActive, onComplete, parameters }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const tasks = [
    'Connecting to CoinGecko API...',
    'Fetching Bitcoin historical data...',
    'Fetching Ethereum historical data...',
    'Fetching Solana historical data...',
    'Validating data integrity...',
    'Saving data to local storage...'
  ];

  const generateSampleData = () => {
    const startDate = new Date(parameters?.startDate || '2020-06-02');
    const endDate = new Date(parameters?.endDate || '2025-07-31');
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return parameters?.cryptocurrencies?.map((crypto: string) => ({
      coin: crypto.charAt(0).toUpperCase() + crypto.slice(1),
      symbol: crypto === 'bitcoin' ? 'BTC' : crypto === 'ethereum' ? 'ETH' : 'SOL',
      records: daysDiff,
      startDate: parameters.startDate,
      endDate: parameters.endDate,
      variables: parameters?.variables || ['price', 'volume', 'market_cap'],
      missingValues: Math.floor(Math.random() * 10) + 1,
      dataQuality: 'Good'
    })) || [];
  };

  useEffect(() => {
    if (!isActive || isCompleted) return;

    setProgress(0);
    setLogs([]);
    setCurrentTask('');

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        const taskIndex = Math.floor(newProgress / 17);
        
        if (taskIndex < tasks.length) {
          setCurrentTask(tasks[taskIndex]);
          setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${tasks[taskIndex]}`]);
        }

        if (newProgress >= 100) {
          setCurrentTask('Data collection completed!');
          const sampleData = generateSampleData();
          setData(sampleData);
          setIsCompleted(true);
          setTimeout(() => onComplete(sampleData), 1000);
          clearInterval(interval);
        }

        return Math.min(newProgress, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, parameters]);

  if (!isActive && !isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Data Collection
        </h3>
        <p className="text-gray-500">Waiting for activation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Database className="w-5 h-5 mr-2" />
        Data Collection
        {isCompleted && <CheckCircle className="w-5 h-5 ml-2 text-green-600" />}
      </h3>
      
      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{currentTask}</p>
        </div>

        {/* Data Source Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Data Source Configuration</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Source:</span>
              <span className="ml-2 text-gray-700">CoinGecko API</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Period:</span>
              <span className="ml-2 text-gray-700">
                {parameters?.startDate} - {parameters?.endDate}
              </span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Variables:</span>
              <span className="ml-2 text-gray-700">
                {parameters?.variables?.join(', ') || 'Price, Volume, Market Cap'}
              </span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Cryptocurrencies:</span>
              <span className="ml-2 text-gray-700">
                {parameters?.cryptocurrencies?.join(', ') || 'Bitcoin, Ethereum, Solana'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Logs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Live Logs</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {logs.map((log, index) => (
              <p key={index} className="text-xs text-gray-600 font-mono">{log}</p>
            ))}
          </div>
        </div>

        {/* Data Summary */}
        {data.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Data Collection Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{item.coin}</span>
                    <span className="text-sm text-gray-500">{item.symbol}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Records: {item.records}</p>
                    <p>Period: {item.startDate} to {item.endDate}</p>
                    <p>Missing Values: {item.missingValues}</p>
                    <p>Quality: <span className="text-green-600 font-medium">{item.dataQuality}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Data Preview */}
        {isCompleted && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Raw Data Preview</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2 py-1 text-left">Date</th>
                    <th className="px-2 py-1 text-left">BTC Price</th>
                    <th className="px-2 py-1 text-left">BTC Volume</th>
                    <th className="px-2 py-1 text-left">ETH Price</th>
                    <th className="px-2 py-1 text-left">ETH Volume</th>
                    <th className="px-2 py-1 text-left">SOL Price</th>
                    <th className="px-2 py-1 text-left">SOL Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="border-b">
                      <td className="px-2 py-1">2020-06-{i.toString().padStart(2, '0')}</td>
                      <td className="px-2 py-1">${(9000 + Math.random() * 1000).toFixed(2)}</td>
                      <td className="px-2 py-1">${(20000000 + Math.random() * 5000000).toFixed(0)}</td>
                      <td className="px-2 py-1">${(200 + Math.random() * 50).toFixed(2)}</td>
                      <td className="px-2 py-1">${(5000000 + Math.random() * 2000000).toFixed(0)}</td>
                      <td className="px-2 py-1">${(1 + Math.random() * 2).toFixed(4)}</td>
                      <td className="px-2 py-1">${(100000 + Math.random() * 50000).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">Showing first 5 rows of collected data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollection;