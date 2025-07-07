import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, AlertCircle, CheckCircle, Activity, DollarSign } from 'lucide-react';

interface RealTimePredictionProps {
  isActive: boolean;
}

interface CryptoPrediction {
  symbol: string;
  name: string;
  currentPrice: number;
  predictions: {
    tft: { price: number; confidence: number; change: number };
    nbeats: { price: number; confidence: number; change: number };
    deepar: { price: number; confidence: number; change: number; uncertainty: number };
  };
  lastUpdated: string;
}

const RealTimePrediction: React.FC<RealTimePredictionProps> = ({ isActive }) => {
  const [predictions, setPredictions] = useState<CryptoPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', basePrice: 45000 },
    { symbol: 'ETH', name: 'Ethereum', basePrice: 2300 },
    { symbol: 'SOL', name: 'Solana', basePrice: 85 }
  ];

  const generatePrediction = (basePrice: number, symbol: string) => {
    const volatility = symbol === 'BTC' ? 0.03 : symbol === 'ETH' ? 0.04 : 0.06;
    const currentPrice = basePrice * (1 + (Math.random() - 0.5) * volatility);
    
    return {
      currentPrice,
      predictions: {
        tft: {
          price: currentPrice * (1 + (Math.random() - 0.5) * volatility * 0.8),
          confidence: 0.85 + Math.random() * 0.1,
          change: (Math.random() - 0.5) * volatility * 100
        },
        nbeats: {
          price: currentPrice * (1 + (Math.random() - 0.5) * volatility * 0.9),
          confidence: 0.80 + Math.random() * 0.1,
          change: (Math.random() - 0.5) * volatility * 100
        },
        deepar: {
          price: currentPrice * (1 + (Math.random() - 0.5) * volatility * 1.1),
          confidence: 0.75 + Math.random() * 0.1,
          change: (Math.random() - 0.5) * volatility * 100,
          uncertainty: Math.random() * 0.15 + 0.05
        }
      },
      lastUpdated: new Date().toLocaleTimeString()
    };
  };

  const fetchPredictions = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPredictions = cryptos.map(crypto => ({
      symbol: crypto.symbol,
      name: crypto.name,
      ...generatePrediction(crypto.basePrice, crypto.symbol)
    }));
    
    setPredictions(newPredictions);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    if (isActive) {
      fetchPredictions();
    }
  }, [isActive]);

  useEffect(() => {
    if (!autoRefresh || !isActive) return;

    const interval = setInterval(() => {
      fetchPredictions();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isActive]);

  const getBestModel = (predictions: CryptoPrediction['predictions']) => {
    const models = [
      { name: 'TFT', confidence: predictions.tft.confidence },
      { name: 'N-BEATS', confidence: predictions.nbeats.confidence },
      { name: 'DeepAR', confidence: predictions.deepar.confidence }
    ];
    return models.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol === 'BTC' || symbol === 'ETH') {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Real-Time Predictions
        </h3>
        <p className="text-gray-500">Complete the analysis to enable real-time predictions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Real-Time Predictions
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
          </div>
          
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
            disabled={!autoRefresh}
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
          
          <button
            onClick={fetchPredictions}
            disabled={isLoading}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {lastUpdate && (
        <div className="mb-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <div className="text-sm text-blue-600">
            Next update in: {autoRefresh ? `${refreshInterval}s` : 'Manual'}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Generating predictions...</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {predictions.map((crypto) => {
          const bestModel = getBestModel(crypto.predictions);
          
          return (
            <div key={crypto.symbol} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{crypto.name}</h4>
                  <p className="text-sm text-gray-500">{crypto.symbol}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">
                    {formatPrice(crypto.currentPrice, crypto.symbol)}
                  </div>
                  <div className="text-xs text-gray-500">Current Price</div>
                </div>
              </div>

              <div className="space-y-3">
                {/* TFT Prediction */}
                <div className={`p-3 rounded-lg ${bestModel.name === 'TFT' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">TFT</span>
                    {bestModel.name === 'TFT' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">
                        {formatPrice(crypto.predictions.tft.price, crypto.symbol)}
                      </div>
                      <div className={`text-sm ${getChangeColor(crypto.predictions.tft.change)}`}>
                        {formatChange(crypto.predictions.tft.change)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Confidence: {(crypto.predictions.tft.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* N-BEATS Prediction */}
                <div className={`p-3 rounded-lg ${bestModel.name === 'N-BEATS' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">N-BEATS</span>
                    {bestModel.name === 'N-BEATS' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">
                        {formatPrice(crypto.predictions.nbeats.price, crypto.symbol)}
                      </div>
                      <div className={`text-sm ${getChangeColor(crypto.predictions.nbeats.change)}`}>
                        {formatChange(crypto.predictions.nbeats.change)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Confidence: {(crypto.predictions.nbeats.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* DeepAR Prediction */}
                <div className={`p-3 rounded-lg ${bestModel.name === 'DeepAR' ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">DeepAR</span>
                    {bestModel.name === 'DeepAR' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Best</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">
                        {formatPrice(crypto.predictions.deepar.price, crypto.symbol)}
                      </div>
                      <div className={`text-sm ${getChangeColor(crypto.predictions.deepar.change)}`}>
                        {formatChange(crypto.predictions.deepar.change)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Confidence: {(crypto.predictions.deepar.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Uncertainty: ±{(crypto.predictions.deepar.uncertainty * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Updated: {crypto.lastUpdated}
              </div>
            </div>
          );
        })}
      </div>

      {predictions.length > 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-800 mb-1">Disclaimer</h5>
              <p className="text-sm text-yellow-700">
                These predictions are generated for demonstration purposes using simulated models. 
                Real-time predictions would require live market data and trained models. 
                Do not use these predictions for actual trading decisions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePrediction;