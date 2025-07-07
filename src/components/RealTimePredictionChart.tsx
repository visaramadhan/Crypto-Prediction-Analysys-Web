import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { TrendingUp, RefreshCw, AlertCircle, CheckCircle, Activity, BarChart3, Play, Pause } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RealTimePredictionChartProps {
  isActive: boolean;
}

interface PricePoint {
  timestamp: string;
  bitcoin: { actual: number; tft: number; nbeats: number; deepar: number };
  ethereum: { actual: number; tft: number; nbeats: number; deepar: number };
  solana: { actual: number; tft: number; nbeats: number; deepar: number };
}

interface ModelPerformance {
  model: string;
  accuracy: number;
  avgError: number;
  trend: 'up' | 'down' | 'stable';
}

const RealTimePredictionChart: React.FC<RealTimePredictionChartProps> = ({ isActive }) => {
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<'bitcoin' | 'ethereum' | 'solana'>('bitcoin');
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cryptoConfig = {
    bitcoin: { name: 'Bitcoin', symbol: 'BTC', basePrice: 45000, color: '#F7931A' },
    ethereum: { name: 'Ethereum', symbol: 'ETH', basePrice: 2300, color: '#627EEA' },
    solana: { name: 'Solana', symbol: 'SOL', basePrice: 85, color: '#9945FF' }
  };

  const generatePricePoint = (): PricePoint => {
    const now = new Date();
    const timestamp = now.toLocaleTimeString();
    
    const generateCryptoPrices = (basePrice: number, volatility: number) => {
      const actual = basePrice * (1 + (Math.random() - 0.5) * volatility);
      return {
        actual,
        tft: actual * (1 + (Math.random() - 0.5) * volatility * 0.8),
        nbeats: actual * (1 + (Math.random() - 0.5) * volatility * 0.9),
        deepar: actual * (1 + (Math.random() - 0.5) * volatility * 1.1)
      };
    };

    return {
      timestamp,
      bitcoin: generateCryptoPrices(45000, 0.003),
      ethereum: generateCryptoPrices(2300, 0.004),
      solana: generateCryptoPrices(85, 0.006)
    };
  };

  const calculateModelPerformance = (history: PricePoint[]): ModelPerformance[] => {
    if (history.length < 2) return [];

    const models = ['tft', 'nbeats', 'deepar'];
    const cryptos = ['bitcoin', 'ethereum', 'solana'] as const;
    
    return models.map(model => {
      let totalError = 0;
      let totalPoints = 0;
      
      cryptos.forEach(crypto => {
        history.forEach(point => {
          const actual = point[crypto].actual;
          const predicted = point[crypto][model as keyof typeof point[typeof crypto]];
          const error = Math.abs((predicted - actual) / actual);
          totalError += error;
          totalPoints++;
        });
      });

      const avgError = totalError / totalPoints;
      const accuracy = Math.max(0, (1 - avgError) * 100);
      
      return {
        model: model.toUpperCase(),
        accuracy,
        avgError: avgError * 100,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down'
      };
    });
  };

  const startRealTimeUpdates = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      const newPoint = generatePricePoint();
      setPriceHistory(prev => {
        const updated = [...prev, newPoint].slice(-50); // Keep last 50 points
        setModelPerformance(calculateModelPerformance(updated));
        return updated;
      });
      setLastUpdate(new Date());
    }, 1000); // Update every second
  };

  const stopRealTimeUpdates = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      // Initialize with some data points
      const initialData = Array.from({ length: 10 }, () => generatePricePoint());
      setPriceHistory(initialData);
      setModelPerformance(calculateModelPerformance(initialData));
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const chartData = {
    labels: priceHistory.map(point => point.timestamp),
    datasets: [
      {
        label: 'Actual Price',
        data: priceHistory.map(point => point[selectedCrypto].actual),
        borderColor: cryptoConfig[selectedCrypto].color,
        backgroundColor: cryptoConfig[selectedCrypto].color + '20',
        borderWidth: 3,
        pointRadius: 2,
        tension: 0.1
      },
      {
        label: 'TFT Prediction',
        data: priceHistory.map(point => point[selectedCrypto].tft),
        borderColor: '#10B981',
        backgroundColor: '#10B98120',
        borderWidth: 2,
        pointRadius: 1,
        borderDash: [5, 5],
        tension: 0.1
      },
      {
        label: 'N-BEATS Prediction',
        data: priceHistory.map(point => point[selectedCrypto].nbeats),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F620',
        borderWidth: 2,
        pointRadius: 1,
        borderDash: [10, 5],
        tension: 0.1
      },
      {
        label: 'DeepAR Prediction',
        data: priceHistory.map(point => point[selectedCrypto].deepar),
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF620',
        borderWidth: 2,
        pointRadius: 1,
        borderDash: [15, 5],
        tension: 0.1
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${cryptoConfig[selectedCrypto].name} Real-Time Price Predictions`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `${context.dataset.label}: $${value.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxTicksLimit: 10
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (USD)'
        },
        ticks: {
          callback: function(value) {
            return '$' + Number(value).toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Real-Time Prediction Charts
        </h3>
        <p className="text-gray-500">Complete the analysis to enable real-time prediction charts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Real-Time Prediction Charts
        </h3>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value as typeof selectedCrypto)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="solana">Solana (SOL)</option>
          </select>
          
          <button
            onClick={isRunning ? stopRealTimeUpdates : startRealTimeUpdates}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isRunning 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop Live Updates
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Live Updates
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${isRunning ? 'text-green-600' : 'text-gray-600'}`}>
            <Activity className={`w-4 h-4 mr-2 ${isRunning ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-medium">
              {isRunning ? 'Live Updates Active' : 'Updates Paused'}
            </span>
          </div>
          {lastUpdate && (
            <div className="text-sm text-gray-600">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Data Points: {priceHistory.length}
          </div>
          <div className="text-sm text-gray-600">
            Update Rate: 1 sec
          </div>
        </div>
      </div>

      {/* Current Prices Display */}
      {priceHistory.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(cryptoConfig).map(([key, config]) => {
            const latestData = priceHistory[priceHistory.length - 1];
            const cryptoData = latestData[key as keyof typeof latestData];
            
            return (
              <div 
                key={key}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedCrypto === key 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCrypto(key as typeof selectedCrypto)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">{config.name}</h4>
                  <span className="text-sm text-gray-500">{config.symbol}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: config.color }}>
                  {formatPrice(cryptoData.actual)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  TFT: {formatPrice(cryptoData.tft)} | 
                  N-BEATS: {formatPrice(cryptoData.nbeats)} | 
                  DeepAR: {formatPrice(cryptoData.deepar)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="mb-6" style={{ height: '400px' }}>
        {priceHistory.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Waiting for data...</p>
            </div>
          </div>
        )}
      </div>

      {/* Model Performance */}
      {modelPerformance.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Real-Time Model Performance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelPerformance.map((model, index) => (
              <div key={model.model} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{model.model}</span>
                  <span className="text-lg">{getTrendIcon(model.trend)}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy:</span>
                    <span className={`font-medium ${
                      model.accuracy > 95 ? 'text-green-600' : 
                      model.accuracy > 90 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {model.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Error:</span>
                    <span className="font-medium text-gray-800">
                      {model.avgError.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        model.accuracy > 95 ? 'bg-green-500' : 
                        model.accuracy > 90 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-800 mb-3">Chart Legend</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-orange-500 mr-2"></div>
            <span>Actual Price (Solid)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-green-500 border-dashed border-t-2 border-green-500 mr-2"></div>
            <span>TFT Prediction</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-500 border-dashed border-t-2 border-blue-500 mr-2"></div>
            <span>N-BEATS Prediction</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-purple-500 border-dashed border-t-2 border-purple-500 mr-2"></div>
            <span>DeepAR Prediction</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800 mb-1">Real-Time Simulation</h5>
            <p className="text-sm text-yellow-700">
              This is a real-time simulation showing how the trained models would perform with live data. 
              The prices are generated using realistic volatility patterns but are not actual market prices. 
              In production, this would connect to live cryptocurrency APIs and use the actual trained models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimePredictionChart;