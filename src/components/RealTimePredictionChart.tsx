import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { Chart } from 'react-chartjs-2';
import { TrendingUp, RefreshCw, AlertCircle, Activity, BarChart3, Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';

ChartJS.register(
  TimeScale,
  LinearScale,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend
);

interface RealTimePredictionChartProps {
  isActive: boolean;
}

interface CandleData {
  x: number; // timestamp
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
}

interface PredictionData {
  timestamp: number;
  bitcoin: {
    actual: CandleData;
    tft: number;
    nbeats: number;
    deepar: number;
  };
  ethereum: {
    actual: CandleData;
    tft: number;
    nbeats: number;
    deepar: number;
  };
  solana: {
    actual: CandleData;
    tft: number;
    nbeats: number;
    deepar: number;
  };
}

interface ModelPerformance {
  model: string;
  accuracy: number;
  avgError: number;
  trend: 'up' | 'down' | 'stable';
}

const RealTimePredictionChart: React.FC<RealTimePredictionChartProps> = ({ isActive }) => {
  const [priceHistory, setPriceHistory] = useState<PredictionData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<'bitcoin' | 'ethereum' | 'solana'>('bitcoin');
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPredictions, setShowPredictions] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const chartRef = useRef<any>(null);

  const cryptoConfig = {
    bitcoin: { name: 'Bitcoin', symbol: 'BTC', basePrice: 45000, color: '#F7931A', volatility: 0.02 },
    ethereum: { name: 'Ethereum', symbol: 'ETH', basePrice: 2300, color: '#627EEA', volatility: 0.025 },
    solana: { name: 'Solana', symbol: 'SOL', basePrice: 85, color: '#9945FF', volatility: 0.03 }
  };

  const generateCandleData = (basePrice: number, volatility: number, previousClose?: number): CandleData => {
    const timestamp = Date.now();
    const open = previousClose || basePrice * (1 + (Math.random() - 0.5) * volatility);
    
    // Generate realistic OHLC data
    const changePercent = (Math.random() - 0.5) * volatility;
    const close = open * (1 + changePercent);
    
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);

    return {
      x: timestamp,
      o: open,
      h: high,
      l: low,
      c: close
    };
  };

  const generatePredictionData = (previousData?: PredictionData): PredictionData => {
    const timestamp = Date.now();
    
    const generateCryptoPredictions = (
      config: typeof cryptoConfig[keyof typeof cryptoConfig], 
      previousClose?: number
    ) => {
      const actual = generateCandleData(config.basePrice, config.volatility, previousClose);
      const currentPrice = actual.c;
      
      return {
        actual,
        tft: currentPrice * (1 + (Math.random() - 0.5) * config.volatility * 0.8),
        nbeats: currentPrice * (1 + (Math.random() - 0.5) * config.volatility * 0.9),
        deepar: currentPrice * (1 + (Math.random() - 0.5) * config.volatility * 1.1)
      };
    };

    return {
      timestamp,
      bitcoin: generateCryptoPredictions(
        cryptoConfig.bitcoin, 
        previousData?.bitcoin.actual.c
      ),
      ethereum: generateCryptoPredictions(
        cryptoConfig.ethereum, 
        previousData?.ethereum.actual.c
      ),
      solana: generateCryptoPredictions(
        cryptoConfig.solana, 
        previousData?.solana.actual.c
      )
    };
  };

  const calculateModelPerformance = (history: PredictionData[]): ModelPerformance[] => {
    if (history.length < 2) return [];

    const models = ['tft', 'nbeats', 'deepar'];
    const cryptos = ['bitcoin', 'ethereum', 'solana'] as const;
    
    return models.map(model => {
      let totalError = 0;
      let totalPoints = 0;
      
      cryptos.forEach(crypto => {
        history.forEach(point => {
          const actual = point[crypto].actual.c;
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
      setPriceHistory(prev => {
        const lastData = prev[prev.length - 1];
        const newPoint = generatePredictionData(lastData);
        const updated = [...prev, newPoint].slice(-200); // Keep last 200 points for smooth scrolling
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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.1));
  };

  useEffect(() => {
    if (isActive) {
      // Initialize with historical data (simulate past month)
      const initialData: PredictionData[] = [];
      const startTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
      
      for (let i = 0; i < 50; i++) {
        const timestamp = startTime + (i * 24 * 60 * 60 * 1000); // Daily intervals
        const previousData = initialData[i - 1];
        
        const data: PredictionData = {
          timestamp,
          bitcoin: {
            actual: generateCandleData(
              cryptoConfig.bitcoin.basePrice, 
              cryptoConfig.bitcoin.volatility, 
              previousData?.bitcoin.actual.c
            ),
            tft: 0, nbeats: 0, deepar: 0
          },
          ethereum: {
            actual: generateCandleData(
              cryptoConfig.ethereum.basePrice, 
              cryptoConfig.ethereum.volatility, 
              previousData?.ethereum.actual.c
            ),
            tft: 0, nbeats: 0, deepar: 0
          },
          solana: {
            actual: generateCandleData(
              cryptoConfig.solana.basePrice, 
              cryptoConfig.solana.volatility, 
              previousData?.solana.actual.c
            ),
            tft: 0, nbeats: 0, deepar: 0
          }
        };

        // Generate predictions based on actual close prices
        data.bitcoin.tft = data.bitcoin.actual.c * (1 + (Math.random() - 0.5) * 0.016);
        data.bitcoin.nbeats = data.bitcoin.actual.c * (1 + (Math.random() - 0.5) * 0.018);
        data.bitcoin.deepar = data.bitcoin.actual.c * (1 + (Math.random() - 0.5) * 0.022);
        
        data.ethereum.tft = data.ethereum.actual.c * (1 + (Math.random() - 0.5) * 0.020);
        data.ethereum.nbeats = data.ethereum.actual.c * (1 + (Math.random() - 0.5) * 0.023);
        data.ethereum.deepar = data.ethereum.actual.c * (1 + (Math.random() - 0.5) * 0.028);
        
        data.solana.tft = data.solana.actual.c * (1 + (Math.random() - 0.5) * 0.024);
        data.solana.nbeats = data.solana.actual.c * (1 + (Math.random() - 0.5) * 0.027);
        data.solana.deepar = data.solana.actual.c * (1 + (Math.random() - 0.5) * 0.033);

        initialData.push(data);
      }
      
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
    datasets: [
      {
        label: `${cryptoConfig[selectedCrypto].name} Price`,
        data: priceHistory.map(point => ({
          x: point.timestamp,
          o: point[selectedCrypto].actual.o,
          h: point[selectedCrypto].actual.h,
          l: point[selectedCrypto].actual.l,
          c: point[selectedCrypto].actual.c
        })),
        borderColor: cryptoConfig[selectedCrypto].color,
        backgroundColor: cryptoConfig[selectedCrypto].color,
        borderWidth: 1,
        color: {
          up: '#10B981', // Green for bullish candles
          down: '#EF4444', // Red for bearish candles
          unchanged: '#6B7280' // Gray for unchanged
        }
      },
      ...(showPredictions ? [
        {
          label: 'TFT Prediction',
          type: 'line' as const,
          data: priceHistory.map(point => ({
            x: point.timestamp,
            y: point[selectedCrypto].tft
          })),
          borderColor: '#10B981',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: 'N-BEATS Prediction',
          type: 'line' as const,
          data: priceHistory.map(point => ({
            x: point.timestamp,
            y: point[selectedCrypto].nbeats
          })),
          borderColor: '#3B82F6',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [10, 5],
          pointRadius: 0,
          tension: 0.1
        },
        {
          label: 'DeepAR Prediction',
          type: 'line' as const,
          data: priceHistory.map(point => ({
            x: point.timestamp,
            y: point[selectedCrypto].deepar
          })),
          borderColor: '#8B5CF6',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [15, 5],
          pointRadius: 0,
          tension: 0.1
        }
      ] : [])
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${cryptoConfig[selectedCrypto].name} Candlestick Chart with Predictions`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: function(context: any) {
            return new Date(context[0].parsed.x).toLocaleString();
          },
          label: function(context: any) {
            const data = context.parsed;
            if (data.o !== undefined) {
              return [
                `Open: $${data.o.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `High: $${data.h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Low: $${data.l.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `Close: $${data.c.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ];
            } else {
              return `${context.dataset.label}: $${data.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'month' as const,
          displayFormats: {
            month: 'MMM yyyy'
          }
        },
        title: {
          display: true,
          text: 'Date'
        },
        ticks: {
          maxTicksLimit: 12,
          autoSkip: true
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)'
        },
        ticks: {
          callback: function(value: any) {
            return '$' + Number(value).toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const
    },
    parsing: {
      xAxisKey: 'x',
      yAxisKey: 'c'
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

  const getCurrentCandle = () => {
    if (priceHistory.length === 0) return null;
    const latest = priceHistory[priceHistory.length - 1];
    return latest[selectedCrypto].actual;
  };

  const currentCandle = getCurrentCandle();

  if (!isActive) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Candlestick Chart - Real-Time Predictions
        </h3>
        <p className="text-gray-500">Complete the analysis to enable real-time candlestick charts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Candlestick Chart - Real-Time Predictions
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-1 border border-gray-300 rounded hover:bg-gray-100"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 border border-gray-300 rounded hover:bg-gray-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPredictions}
              onChange={(e) => setShowPredictions(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Show Predictions</span>
          </label>
          
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
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
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
            Candles: {priceHistory.length}
          </div>
          <div className="text-sm text-gray-600">
            Timeframe: 1 sec
          </div>
        </div>
      </div>

      {/* Current Candle Info */}
      {currentCandle && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-3">
            Current {cryptoConfig[selectedCrypto].name} Candle
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Open</div>
              <div className="font-bold text-gray-800">{formatPrice(currentCandle.o)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">High</div>
              <div className="font-bold text-green-600">{formatPrice(currentCandle.h)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Low</div>
              <div className="font-bold text-red-600">{formatPrice(currentCandle.l)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Close</div>
              <div className={`font-bold ${currentCandle.c >= currentCandle.o ? 'text-green-600' : 'text-red-600'}`}>
                {formatPrice(currentCandle.c)}
              </div>
            </div>
          </div>
          <div className="mt-2 text-center">
            <span className={`text-sm font-medium ${currentCandle.c >= currentCandle.o ? 'text-green-600' : 'text-red-600'}`}>
              {currentCandle.c >= currentCandle.o ? '🕯️ Bullish (Green)' : '🕯️ Bearish (Red)'} | 
              Change: {((currentCandle.c - currentCandle.o) / currentCandle.o * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="mb-6" style={{ height: '500px' }}>
        {priceHistory.length > 0 ? (
          <Chart 
            ref={chartRef}
            type="candlestick" 
            data={chartData} 
            options={chartOptions} 
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Loading candlestick data...</p>
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
            {modelPerformance.map((model) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-6 bg-green-500 mr-2 rounded-sm"></div>
              <span>Bullish Candle (Close {'>'} Open)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-6 bg-red-500 mr-2 rounded-sm"></div>
              <span>Bearish Candle (Close {'<'} Open)</span>
            </div>
          </div>
          {showPredictions && (
            <div className="space-y-2">
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
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h5 className="font-medium text-yellow-800 mb-1">Candlestick Chart Simulation</h5>
            <p className="text-sm text-yellow-700">
              Candlestick chart menampilkan data OHLC (Open, High, Low, Close) dengan lilin hijau untuk kenaikan harga 
              dan lilin merah untuk penurunan harga. Data bergeser ke kiri saat data baru masuk, dengan sumbu X 
              menampilkan tanggal per bulan. Fitur zoom tersedia untuk analisis detail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimePredictionChart;