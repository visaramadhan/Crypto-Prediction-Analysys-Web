import React from 'react';
import { TrendingUp, Award, BarChart3, PieChart, AlertCircle, CheckCircle } from 'lucide-react';

interface ResultsVisualizationProps {
  isActive: boolean;
}

const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({ isActive }) => {
  const finalResults = {
    winner: 'Temporal Fusion Transformer (TFT)',
    performance: {
      tft: { rank: 1, avgMape: 2.78, avgR2: 0.9245, improvement: '+15.2%' },
      nbeats: { rank: 2, avgMape: 3.15, avgR2: 0.9034, improvement: '+8.7%' },
      deepar: { rank: 3, avgMape: 3.44, avgR2: 0.8838, improvement: 'baseline' }
    },
    insights: [
      'TFT menunjukkan performa terbaik dengan MAPE rata-rata 2.78%',
      'Kemampuan attention mechanism TFT sangat efektif untuk data cryptocurrency',
      'N-BEATS menunjukkan performa yang baik dalam menangkap tren jangka pendek',
      'DeepAR memberikan prediksi probabilistik yang valuable untuk risk assessment',
      'Volatilitas tinggi cryptocurrency masih menjadi tantangan utama'
    ],
    recommendations: [
      'Gunakan TFT untuk prediksi harga harian dengan akurasi tinggi',
      'Kombinasikan dengan N-BEATS untuk analisis tren komprehensif',
      'Manfaatkan uncertainty estimates dari DeepAR untuk manajemen risiko',
      'Pertimbangkan ensemble methods untuk meningkatkan robustness'
    ]
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 opacity-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Results & Visualization
        </h3>
        <p className="text-gray-500">Waiting for activation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Results & Visualization
      </h3>
      
      <div className="space-y-6">
        {/* Winner Announcement */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Award className="w-6 h-6 mr-2" />
                <h4 className="text-xl font-bold">Winner: {finalResults.winner}</h4>
              </div>
              <p className="text-green-100">
                Achieved the lowest MAPE across all cryptocurrencies with superior accuracy
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{finalResults.performance.tft.avgMape}%</div>
              <div className="text-green-100">Average MAPE</div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance Comparison
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(finalResults.performance).map(([model, data]: [string, any]) => (
              <div key={model} className={`rounded-lg p-4 ${
                data.rank === 1 ? 'bg-green-100 border-2 border-green-400' :
                data.rank === 2 ? 'bg-blue-100 border-2 border-blue-400' :
                'bg-purple-100 border-2 border-purple-400'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold ${
                    data.rank === 1 ? 'text-green-800' :
                    data.rank === 2 ? 'text-blue-800' :
                    'text-purple-800'
                  }`}>
                    #{data.rank} {model.toUpperCase()}
                  </span>
                  {data.rank === 1 && <Award className="w-5 h-5 text-green-600" />}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">MAPE:</span>
                    <span className="font-medium">{data.avgMape}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">R²:</span>
                    <span className="font-medium">{data.avgR2}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Improvement:</span>
                    <span className={`font-medium ${
                      data.improvement.includes('+') ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {data.improvement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Performance Chart */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Performance Metrics Visualization
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAPE Comparison */}
            <div>
              <h5 className="font-medium text-gray-700 mb-3">MAPE Comparison (%)</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">TFT</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(2.78 / 3.44) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">2.78%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">N-BEATS</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(3.15 / 3.44) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">3.15%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">DeepAR</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: '100%' }}
                    >
                      <span className="text-xs text-white font-medium">3.44%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* R² Comparison */}
            <div>
              <h5 className="font-medium text-gray-700 mb-3">R² Score Comparison</h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">TFT</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(0.9245 / 0.9245) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">0.9245</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">N-BEATS</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(0.9034 / 0.9245) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">0.9034</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">DeepAR</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 mx-3">
                    <div 
                      className="bg-purple-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(0.8838 / 0.9245) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">0.8838</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-medium text-blue-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Key Insights
          </h4>
          <div className="space-y-3">
            {finalResults.insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <p className="text-blue-800 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-amber-50 rounded-lg p-6">
          <h4 className="font-medium text-amber-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Recommendations
          </h4>
          <div className="space-y-3">
            {finalResults.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <p className="text-amber-800 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Summary */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-6">
          <h4 className="font-bold text-xl mb-4">Conclusion</h4>
          <p className="text-gray-200 leading-relaxed">
            Berdasarkan analisis komprehensif terhadap 1887 hari data cryptocurrency (Bitcoin, Ethereum, Solana), 
            <strong className="text-yellow-300"> Temporal Fusion Transformer (TFT)</strong> terbukti menjadi algoritma 
            terbaik untuk prediksi harga cryptocurrency dengan MAPE rata-rata <strong className="text-green-300">2.78%</strong> 
            dan R² score <strong className="text-green-300">0.9245</strong>. Kemampuan attention mechanism dan 
            variable selection networks TFT sangat efektif dalam menangani kompleksitas dan volatilitas tinggi 
            pasar cryptocurrency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsVisualization;