import React, { useState } from 'react';
import { Settings, Info, Play, AlertCircle, CheckCircle, Lightbulb, Target, TrendingUp } from 'lucide-react';

interface ParameterConfigurationProps {
  onStartAnalysis: (params: any) => void;
  isAnalysisRunning: boolean;
}

const ParameterConfiguration: React.FC<ParameterConfigurationProps> = ({ 
  onStartAnalysis, 
  isAnalysisRunning 
}) => {
  const [params, setParams] = useState({
    // Data Collection Parameters
    cryptocurrencies: ['bitcoin', 'ethereum', 'solana'],
    startDate: '2020-06-02',
    endDate: '2025-07-31',
    variables: ['price', 'volume', 'market_cap'],
    
    // Preprocessing Parameters
    normalizationMethod: 'minmax',
    interpolationMethod: 'linear',
    missingValueThreshold: 0.05,
    
    // Model Training Parameters
    trainSplit: 0.8,
    validationSplit: 0.1,
    testSplit: 0.1,
    
    // TFT Parameters
    tft: {
      learningRate: 0.001,
      batchSize: 64,
      epochs: 10,
      hiddenSize: 128,
      attentionHeadSize: 4,
      dropout: 0.1,
      optimizer: 'adam'
    },
    
    // N-BEATS Parameters
    nbeats: {
      learningRate: 0.001,
      batchSize: 64,
      epochs: 10,
      stackTypes: ['trend', 'seasonality'],
      numBlocks: 3,
      numLayers: 4,
      layerWidths: 512
    },
    
    // DeepAR Parameters
    deepar: {
      learningRate: 0.001,
      batchSize: 64,
      epochs: 10,
      numLayers: 2,
      numCells: 40,
      dropout: 0.1,
      contextLength: 30
    }
  });

  const [activeTab, setActiveTab] = useState('data');
  const [showGuidance, setShowGuidance] = useState(true);

  const handleParameterChange = (section: string, key: string, value: any) => {
    if (section === 'root') {
      setParams(prev => ({ ...prev, [key]: value }));
    } else {
      setParams(prev => ({
        ...prev,
        [section]: { ...prev[section], [key]: value }
      }));
    }
  };

  const validateParameters = () => {
    const errors = [];
    
    if (Math.abs(params.trainSplit + params.validationSplit + params.testSplit - 1) > 0.001) {
      errors.push('Data split ratios must sum to 1.0');
    }
    
    if (params.tft.epochs < 1 || params.tft.epochs > 100) {
      errors.push('TFT epochs must be between 1 and 100');
    }
    
    if (params.tft.batchSize < 16 || params.tft.batchSize > 512) {
      errors.push('Batch size must be between 16 and 512');
    }
    
    if (params.cryptocurrencies.length === 0) {
      errors.push('At least one cryptocurrency must be selected');
    }
    
    return errors;
  };

  const handleStartAnalysis = () => {
    const errors = validateParameters();
    if (errors.length === 0) {
      onStartAnalysis(params);
    } else {
      alert('Please fix parameter errors:\n' + errors.join('\n'));
    }
  };

  const guidanceContent = {
    data: {
      title: 'Data Collection & Preprocessing Guide',
      description: 'Konfigurasi sumber data dan metode preprocessing yang akan mempengaruhi kualitas input model',
      items: [
        {
          param: 'Cryptocurrencies Selection',
          description: 'Bitcoin, Ethereum, dan Solana dipilih karena mewakili tiga kategori berbeda: store of value (BTC), smart contract platform (ETH), dan high-performance blockchain (SOL). Kombinasi ini memberikan diversifikasi market cap dan volatilitas.',
          impact: 'Lebih banyak cryptocurrency = analisis lebih komprehensif tapi waktu training lebih lama',
          tips: [
            'Bitcoin: Paling stabil, cocok untuk baseline comparison',
            'Ethereum: Volatilitas sedang, banyak use case',
            'Solana: High volatility, cocok untuk test extreme cases'
          ],
          recommendation: 'Gunakan ketiga cryptocurrency untuk analisis lengkap'
        },
        {
          param: 'Date Range (2020-2025)',
          description: 'Periode 5+ tahun memberikan data sufficient untuk deep learning (1887 hari). Mencakup bull market 2020-2021, bear market 2022, dan recovery 2023-2024.',
          impact: 'Data lebih banyak = model lebih robust, tapi computational cost meningkat',
          tips: [
            'Minimum 1000 hari untuk deep learning yang reliable',
            'Include berbagai market conditions (bull/bear)',
            'Avoid periode terlalu pendek (<6 bulan)'
          ],
          recommendation: 'Gunakan full range untuk hasil optimal'
        },
        {
          param: 'Normalization Method',
          description: 'Min-Max scaling mengubah semua variabel ke rentang [0,1]. Penting untuk konvergensi neural networks karena cryptocurrency memiliki scale yang sangat berbeda (harga vs volume).',
          impact: 'Normalisasi yang tepat = konvergensi lebih cepat dan akurasi lebih tinggi',
          tips: [
            'Min-Max: Terbaik untuk bounded data, preserve relationships',
            'Standard: Bagus jika data normal distribution',
            'Robust: Resistant terhadap outliers'
          ],
          recommendation: 'Min-Max scaling untuk cryptocurrency data'
        },
        {
          param: 'Interpolation Method',
          description: 'Menangani missing values yang bisa terjadi karena API downtime atau market holidays. Linear interpolation paling simple dan effective untuk time series.',
          impact: 'Method yang tepat = data continuity terjaga, model tidak confused',
          tips: [
            'Linear: Simple, fast, good untuk short gaps',
            'Polynomial: Better untuk complex patterns',
            'Spline: Smooth curves, good untuk longer gaps'
          ],
          recommendation: 'Linear interpolation untuk cryptocurrency (24/7 market)'
        }
      ]
    },
    training: {
      title: 'Training Configuration Guide',
      description: 'Pembagian data yang optimal untuk training, validation, dan testing',
      items: [
        {
          param: 'Data Split Strategy',
          description: '80/10/10 split adalah standard practice untuk time series. Training data harus cukup besar untuk deep learning, validation untuk hyperparameter tuning, test untuk final evaluation.',
          impact: 'Split ratio mempengaruhi model generalization dan reliability hasil evaluasi',
          tips: [
            '80% training: Cukup data untuk deep learning convergence',
            '10% validation: Adequate untuk hyperparameter optimization',
            '10% test: Unbiased evaluation pada unseen data'
          ],
          recommendation: 'Gunakan 80/10/10 untuk balance optimal'
        }
      ]
    },
    models: {
      title: 'Model Architecture Guide',
      description: 'Pemahaman karakteristik dan konfigurasi optimal untuk setiap algoritma',
      items: [
        {
          param: 'Learning Rate Strategy',
          description: 'Mengontrol seberapa cepat model belajar. 0.001 adalah sweet spot untuk cryptocurrency data yang volatile. Terlalu tinggi = overshoot optimal, terlalu rendah = convergence lambat.',
          impact: 'Learning rate optimal = faster convergence dengan akurasi maksimal',
          tips: [
            '0.01: Terlalu tinggi untuk crypto (volatile)',
            '0.001: Optimal untuk most cases',
            '0.0001: Terlalu lambat, butuh epochs lebih banyak'
          ],
          recommendation: 'Start dengan 0.001, adjust jika loss tidak turun'
        },
        {
          param: 'Batch Size Optimization',
          description: 'Jumlah samples per gradient update. 64 memberikan balance antara gradient stability dan memory efficiency. Crypto data benefit dari batch size sedang.',
          impact: 'Batch size mempengaruhi gradient noise, memory usage, dan training speed',
          tips: [
            '32: Good untuk small datasets atau limited memory',
            '64: Sweet spot untuk crypto prediction',
            '128+: Butuh memory besar, diminishing returns'
          ],
          recommendation: 'Gunakan 64 untuk optimal performance'
        },
        {
          param: 'Epochs & Early Stopping',
          description: '10 epochs dengan early stopping mencegah overfitting. Crypto data complex tapi prone to overfitting karena noise tinggi.',
          impact: 'Epochs optimal = model learns patterns tanpa memorizing noise',
          tips: [
            '5-10: Good starting point dengan early stopping',
            '15+: Risk overfitting pada crypto data',
            'Monitor validation loss untuk optimal stopping'
          ],
          recommendation: '10 epochs dengan validation monitoring'
        }
      ]
    },
    tft: {
      title: 'Temporal Fusion Transformer Guide',
      description: 'TFT menggunakan attention mechanism untuk multivariate time series dengan variable selection',
      items: [
        {
          param: 'Hidden Size & Architecture',
          description: 'Hidden size 128 optimal untuk crypto data complexity. TFT architecture includes variable selection networks, attention layers, dan gated residual networks.',
          impact: 'Hidden size mempengaruhi model capacity dan computational cost',
          tips: [
            '64: Lightweight, fast training',
            '128: Optimal untuk crypto complexity',
            '256+: Overkill, risk overfitting'
          ],
          recommendation: 'Hidden size 128 untuk balance optimal'
        },
        {
          param: 'Attention Mechanism',
          description: 'Attention heads memungkinkan model focus pada different aspects. 4 heads cukup untuk capture price, volume, market cap relationships.',
          impact: 'Attention heads = model interpretability dan pattern recognition',
          tips: [
            '1-2: Simple patterns only',
            '4: Good untuk multivariate crypto',
            '8+: Computational overhead tanpa significant gain'
          ],
          recommendation: '4 attention heads untuk crypto analysis'
        }
      ]
    },
    nbeats: {
      title: 'N-BEATS Architecture Guide',
      description: 'N-BEATS menggunakan hierarchical decomposition untuk trend dan seasonality',
      items: [
        {
          param: 'Stack Configuration',
          description: 'Trend dan seasonality stacks menangkap different components. Crypto memiliki strong trend tapi weak seasonality.',
          impact: 'Stack types mempengaruhi model ability untuk decompose time series',
          tips: [
            'Trend stack: Essential untuk crypto long-term patterns',
            'Seasonality: Less important untuk 24/7 crypto market',
            'Generic: Fallback untuk unexplained patterns'
          ],
          recommendation: 'Focus pada trend stack untuk crypto'
        }
      ]
    },
    deepar: {
      title: 'DeepAR Probabilistic Guide',
      description: 'DeepAR memberikan probabilistic forecasts dengan uncertainty quantification',
      items: [
        {
          param: 'Probabilistic Output',
          description: 'DeepAR menghasilkan distribution bukan point estimates. Valuable untuk risk assessment dalam crypto trading.',
          impact: 'Probabilistic forecasts = better risk management dan uncertainty quantification',
          tips: [
            'Context length 30: Good untuk capture monthly patterns',
            'LSTM layers: Capture sequential dependencies',
            'Uncertainty bands: Critical untuk volatile crypto'
          ],
          recommendation: 'Leverage uncertainty estimates untuk risk management'
        }
      ]
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Parameter Configuration
        </h3>
        <button
          onClick={() => setShowGuidance(!showGuidance)}
          className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Info className="w-4 h-4 mr-2" />
          {showGuidance ? 'Hide' : 'Show'} Guidance
        </button>
      </div>

      {showGuidance && guidanceContent[activeTab] && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
          <div className="flex items-start space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-lg mb-2">{guidanceContent[activeTab].title}</h4>
              <p className="text-blue-700 mb-4">{guidanceContent[activeTab].description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {guidanceContent[activeTab].items.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800 mb-2">{item.param}</h5>
                    <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <TrendingUp className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="font-medium text-yellow-800">Impact</span>
                        </div>
                        <p className="text-yellow-700 text-xs">{item.impact}</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">Recommendation</span>
                        </div>
                        <p className="text-green-700 text-xs">{item.recommendation}</p>
                      </div>
                    </div>
                    
                    {item.tips && (
                      <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <span className="font-medium text-gray-800 text-sm">Tips:</span>
                        <ul className="mt-1 space-y-1">
                          {item.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-gray-600 text-xs flex items-start">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'data', label: 'Data & Preprocessing' },
          { id: 'training', label: 'Training Setup' },
          { id: 'tft', label: 'TFT Parameters' },
          { id: 'nbeats', label: 'N-BEATS Parameters' },
          { id: 'deepar', label: 'DeepAR Parameters' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Parameter Forms */}
      <div className="space-y-6">
        {activeTab === 'data' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cryptocurrencies
              </label>
              <div className="space-y-2">
                {['bitcoin', 'ethereum', 'solana'].map(crypto => (
                  <label key={crypto} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.cryptocurrencies.includes(crypto)}
                      onChange={(e) => {
                        const newCryptos = e.target.checked
                          ? [...params.cryptocurrencies, crypto]
                          : params.cryptocurrencies.filter(c => c !== crypto);
                        handleParameterChange('root', 'cryptocurrencies', newCryptos);
                      }}
                      className="mr-2"
                    />
                    <span className="capitalize">{crypto}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="space-y-3">
                <input
                  type="date"
                  value={params.startDate}
                  onChange={(e) => handleParameterChange('root', 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={params.endDate}
                  onChange={(e) => handleParameterChange('root', 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Normalization Method
              </label>
              <select
                value={params.normalizationMethod}
                onChange={(e) => handleParameterChange('root', 'normalizationMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="minmax">Min-Max Scaling</option>
                <option value="standard">Standard Scaling</option>
                <option value="robust">Robust Scaling</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interpolation Method
              </label>
              <select
                value={params.interpolationMethod}
                onChange={(e) => handleParameterChange('root', 'interpolationMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="linear">Linear Interpolation</option>
                <option value="polynomial">Polynomial Interpolation</option>
                <option value="spline">Spline Interpolation</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Split (%)
              </label>
              <input
                type="number"
                min="0.5"
                max="0.9"
                step="0.05"
                value={params.trainSplit}
                onChange={(e) => handleParameterChange('root', 'trainSplit', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 0.8 (80%)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validation Split (%)
              </label>
              <input
                type="number"
                min="0.05"
                max="0.3"
                step="0.05"
                value={params.validationSplit}
                onChange={(e) => handleParameterChange('root', 'validationSplit', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 0.1 (10%)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Split (%)
              </label>
              <input
                type="number"
                min="0.05"
                max="0.3"
                step="0.05"
                value={params.testSplit}
                onChange={(e) => handleParameterChange('root', 'testSplit', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 0.1 (10%)</p>
            </div>
          </div>
        )}

        {activeTab === 'tft' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={params.tft.learningRate}
                onChange={(e) => handleParameterChange('tft', 'learningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Size
              </label>
              <select
                value={params.tft.batchSize}
                onChange={(e) => handleParameterChange('tft', 'batchSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
                <option value={128}>128</option>
                <option value={256}>256</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Epochs
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={params.tft.epochs}
                onChange={(e) => handleParameterChange('tft', 'epochs', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hidden Size
              </label>
              <select
                value={params.tft.hiddenSize}
                onChange={(e) => handleParameterChange('tft', 'hiddenSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={64}>64</option>
                <option value={128}>128</option>
                <option value={256}>256</option>
                <option value={512}>512</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attention Head Size
              </label>
              <select
                value={params.tft.attentionHeadSize}
                onChange={(e) => handleParameterChange('tft', 'attentionHeadSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={8}>8</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dropout Rate
              </label>
              <input
                type="number"
                min="0"
                max="0.5"
                step="0.05"
                value={params.tft.dropout}
                onChange={(e) => handleParameterChange('tft', 'dropout', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {activeTab === 'nbeats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={params.nbeats.learningRate}
                onChange={(e) => handleParameterChange('nbeats', 'learningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Size
              </label>
              <select
                value={params.nbeats.batchSize}
                onChange={(e) => handleParameterChange('nbeats', 'batchSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
                <option value={128}>128</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Blocks
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={params.nbeats.numBlocks}
                onChange={(e) => handleParameterChange('nbeats', 'numBlocks', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layer Widths
              </label>
              <select
                value={params.nbeats.layerWidths}
                onChange={(e) => handleParameterChange('nbeats', 'layerWidths', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={256}>256</option>
                <option value={512}>512</option>
                <option value={1024}>1024</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'deepar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Rate
              </label>
              <input
                type="number"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={params.deepar.learningRate}
                onChange={(e) => handleParameterChange('deepar', 'learningRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Layers
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={params.deepar.numLayers}
                onChange={(e) => handleParameterChange('deepar', 'numLayers', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cells
              </label>
              <input
                type="number"
                min="10"
                max="100"
                step="10"
                value={params.deepar.numCells}
                onChange={(e) => handleParameterChange('deepar', 'numCells', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Context Length
              </label>
              <input
                type="number"
                min="7"
                max="60"
                value={params.deepar.contextLength}
                onChange={(e) => handleParameterChange('deepar', 'contextLength', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validateParameters().length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h4 className="font-medium text-red-800">Parameter Validation Errors</h4>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {validateParameters().map((error, index) => (
              <li key={index} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Start Analysis Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleStartAnalysis}
          disabled={isAnalysisRunning || validateParameters().length > 0}
          className={`flex items-center px-8 py-3 rounded-lg font-medium text-lg transition-all ${
            isAnalysisRunning || validateParameters().length > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {isAnalysisRunning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Analysis Running...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-3" />
              Start Analysis
            </>
          )}
        </button>
      </div>

      {validateParameters().length === 0 && !isAnalysisRunning && (
        <div className="mt-4 flex items-center justify-center text-green-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">All parameters are valid. Ready to start analysis.</span>
        </div>
      )}
    </div>
  );
};

export default ParameterConfiguration;