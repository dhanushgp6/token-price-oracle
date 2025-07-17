import React, { useState } from 'react';
import { Search, Database, TrendingUp, Zap, Globe, Clock, DollarSign, Activity } from 'lucide-react';
import { apiService, PriceResponse, ScheduleResponse } from './services/api';
import { StatusBadge } from './components/StatusBadge';

function App() {
  const [token, setToken] = useState('0xA0b86991c31C4F66045C0C0aAbC277318495E1d');
  const [network, setNetwork] = useState('ethereum');
  const [timestamp, setTimestamp] = useState('1678901234');
  const [loading, setLoading] = useState(false);
  const [priceResult, setPriceResult] = useState<PriceResponse | null>(null);
  const [scheduleResult, setScheduleResult] = useState<ScheduleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getTokenPrice(token, network, parseInt(timestamp));
      setPriceResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch price');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.scheduleHistoryFetch(token, network);
      setScheduleResult(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to schedule history fetch');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (ts: number) => {
    return new Date(ts * 1000).toLocaleString();
  };

  const quickTimestamps = [
    { label: '1 Hour Ago', value: Math.floor((Date.now() - 3600000) / 1000) },
    { label: '1 Day Ago', value: Math.floor((Date.now() - 86400000) / 1000) },
    { label: '1 Week Ago', value: Math.floor((Date.now() - 604800000) / 1000) },
    { label: 'Sample Date', value: 1678901234 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
     

      <div className="relative z-10 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Token Price Oracle
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get historical token prices with advanced interpolation, intelligent caching, and real-time data processing
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">Redis caching for instant responses</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Storage</h3>
                <p className="text-gray-600 text-sm">MongoDB for persistent history</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Interpolation</h3>
                <p className="text-gray-600 text-sm">Predict missing price points</p>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Search className="mr-3" />
                Price Query Interface
              </h2>
              <p className="text-blue-200 mt-2" style={{color: '#1e40af'}}>Enter token details to fetch historical price data</p>
            </div>
            
            <div className="p-8">
              {/* Input Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-2" />
                    Token Address
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="0x..."
                  />
                  <p className="text-xs text-gray-500">Enter the token contract address</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="inline w-4 h-4 mr-2" />
                    Network
                  </label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  >
                    <option value="ethereum">🔷 Ethereum</option>
                    <option value="polygon">🟣 Polygon</option>
                  </select>
                  <p className="text-xs text-gray-500">Select blockchain network</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Timestamp
                  </label>
                  <input
                    type="text"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Unix timestamp"
                  />
                  <p className="text-xs text-gray-500">Unix timestamp for price query</p>
                </div>
              </div>

              {/* Quick Timestamp Buttons */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick Select:</p>
                <div className="flex flex-wrap gap-2">
                  {quickTimestamps.map((quick, index) => (
                    <button
                      key={index}
                      onClick={() => setTimestamp(quick.value.toString())}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleGetPrice}
                  disabled={loading}
className="flex-1 flex items-center justify-center px-6 py-4 btn-blue rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
style={{color: '#000', fontWeight: 'bold'}}                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Get Token Price'
                  )}
                </button>
                
                <button
                  onClick={handleScheduleHistory}
                  disabled={loading}
className="flex-1 flex items-center justify-center px-6 py-4 btn-blue rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
style={{color: '#000', fontWeight: 'bold'}}                >
                  <Database className="mr-2 h-5 w-5" />
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule History Fetch'
                  )}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        <strong>Error:</strong> {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Result */}
              {priceResult && (
                <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">Price Result</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-20">Price:</span>
                        <span className="text-3xl font-bold text-green-600">${priceResult.price.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-20">Source:</span>
                        <StatusBadge source={priceResult.source} />
                      </div>
                      <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-600 w-20">Network:</span>
                        <span className="capitalize font-semibold text-gray-900">{priceResult.network}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600 block mb-1">Token:</span>
                        <code className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-mono break-all">{priceResult.token}</code>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600 block mb-1">Timestamp:</span>
                        <span className="text-sm text-gray-900">{formatTimestamp(priceResult.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {priceResult.interpolationData && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <h4 className="font-semibold mb-3 text-purple-800 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        📊 Interpolation Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-medium text-gray-700">Before:</p>
                          <p className="text-purple-600">${priceResult.interpolationData.before.price.toFixed(6)}</p>
                          <p className="text-xs text-gray-500">{formatTimestamp(priceResult.interpolationData.before.timestamp)}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="font-medium text-gray-700">After:</p>
                          <p className="text-purple-600">${priceResult.interpolationData.after.price.toFixed(6)}</p>
                          <p className="text-xs text-gray-500">{formatTimestamp(priceResult.interpolationData.after.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule Result */}
              {scheduleResult && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <Database className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">Schedule Result</h3>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-semibold text-green-700">Job Scheduled Successfully!</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Status:</span> {scheduleResult.message}</p>
                      <p><span className="font-medium">Job ID:</span> <code className="bg-gray-100 px-2 py-1 rounded">{scheduleResult.jobId}</code></p>
                      <p><span className="font-medium">Estimated Duration:</span> {scheduleResult.estimatedDuration}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Built using React, TypeScript, Node.js, MongoDB & Redis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
