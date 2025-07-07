import React from 'react';
import { TrendingUp, Brain, BarChart3, Info } from 'lucide-react';

const Header = () => {
  return (
    <div>
      {/* Main Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Crypto Prediction Analytics</h1>
                <p className="text-blue-100 mt-1">
                  Analisis Prediksi Harga Cryptocurrency menggunakan TFT, N-BEATS & DeepAR
                </p>
                <p className="text-blue-200 text-sm mt-2 font-medium">
                  Dikembangkan oleh Fajar Nugraha | Universitas Pamulang sebagai penelitian Thesis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  <span className="text-sm text-blue-100">Live Analysis</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm text-blue-100">Real-time Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <div className="bg-white border-b border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Tentang Platform Analisis Ini</h3>
                <div className="text-blue-700 space-y-3">
                  <p>
                    Platform ini adalah sistem analisis prediksi harga cryptocurrency yang menggunakan tiga algoritma 
                    deep learning terdepan: <strong>Temporal Fusion Transformer (TFT)</strong>, <strong>N-BEATS</strong>, 
                    dan <strong>DeepAR</strong>. Sistem ini dirancang untuk memberikan perbandingan komprehensif 
                    terhadap akurasi prediksi harga Bitcoin, Ethereum, dan Solana.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-800 mb-2">🎯 Tujuan Penelitian</h4>
                      <p className="text-sm text-blue-600">
                        Membandingkan akurasi prediksi harga harian cryptocurrency menggunakan 
                        tiga algoritma advanced untuk menentukan model terbaik.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-800 mb-2">📊 Data & Periode</h4>
                      <p className="text-sm text-blue-600">
                        Menganalisis data harga penutupan, volume, dan market cap dari 
                        2 Juni 2020 - 31 Juli 2025 (1887 hari) untuk 3 cryptocurrency.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-blue-800 mb-2">🔬 Metodologi</h4>
                      <p className="text-sm text-blue-600">
                        Preprocessing dengan Min-Max scaling, training dengan 80/10/10 split, 
                        evaluasi menggunakan MAE, RMSE, MAPE, dan R² metrics.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-yellow-800 mb-2">💡 Cara Menggunakan Platform</h4>
                    <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                      <li>Konfigurasi parameter sesuai kebutuhan analisis Anda</li>
                      <li>Klik "Start Analysis" untuk memulai proses otomatis</li>
                      <li>Monitor progress melalui sidebar dan log real-time</li>
                      <li>Download hasil analisis dalam berbagai format</li>
                      <li>Interpretasi hasil untuk pengambilan keputusan investasi</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;