import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldCheck, Globe, Clock, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import Sidebar from '../Components/Sidebar';
import Footer from '../Components/Footer';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-[#12111A] border border-violet-500/10 p-6 rounded-2xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-violet-600/10 rounded-xl text-violet-500">
        <Icon size={24} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${trend >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-gray-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
  </div>
);

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('analyze');
  const [loading, setLoading] = useState(true);
  
  // Real data state trackers
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    successRate: '100%',
    activeServices: 0,
    avgLatency: '0ms',
    trafficData: [],
    statusDist: [],
    servicePerformance: []
  });

  const navigate = useNavigate();

  useEffect(() => { 
    const token = localStorage.getItem('synapse_token');
    if (!token) {
      navigate('/verify', { replace: true });
      return;
    }

    // Fetch systemic global infrastructure telemetry
    const fetchGlobalMetrics = async () => { 
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard-mgmt/actions/metrics', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        setMetrics({
          totalRequests: data.totalRequests || 0,
          successRate: `${data.successRate || 100}%`,
          activeServices: data.activeServices || 0,
          avgLatency: `${data.avgLatency || 0}ms`,
          trafficData: data.trafficData || [],
          statusDist: data.statusDist || [],
          servicePerformance: data.servicePerformance || []
        });
      } catch (err) {
        console.error('❌ Failed to pull cluster dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalMetrics();
    // Optional: Set up a polling interval for live updates every 30 seconds
    const interval = setInterval(fetchGlobalMetrics, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0A0F] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-violet-500 mb-4" size={40} />
        <p className="text-gray-400 text-sm animate-pulse">Aggregating cluster telemetry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0A0F] text-white">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="lg:ml-64 p-4 lg:p-8 transition-all duration-300 pt-20 lg:pt-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Infrastructure <span className="text-violet-500">Metrics</span></h1>
          <p className="text-gray-400 mt-1">Real-time traffic analysis for your SYNAPSE clusters.</p>
        </header>

        {activePage === 'analyze' ? (
          <div className="space-y-6">
            
            {/* Top Row: Real Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Requests" value={metrics.totalRequests.toLocaleString()} icon={Activity} trend={12} />
              <StatCard title="Success Rate" value={metrics.successRate} icon={ShieldCheck} trend={0.1} />
              <StatCard title="Active Services" value={metrics.activeServices} icon={Globe} trend={0} />
              <StatCard title="Avg Latency" value={metrics.avgLatency} icon={Clock} trend={-4} />
            </div>

            {/* Middle Row: Dynamic Traffic Area Chart */}
            <div className="bg-[#12111A] border border-violet-500/10 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Request Traffic (24h timeline)</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-3 h-3 bg-violet-600 rounded-sm" /> Live Inbound Requests
                </div>
              </div>
              <div className="h-[350px] w-full">
                {metrics.trafficData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    No traffic logs registered within the last 24 hours.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.trafficData}>
                      <defs>
                        <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="100%">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f1e2e" vertical={false} />
                      <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#12111A', borderColor: '#2e2c3d', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="requests" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorReq)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Bottom Row: Distribution charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Pie Chart Layer */}
              <div className="lg:col-span-1 bg-[#12111A] border border-violet-500/10 p-6 rounded-2xl flex flex-col items-center">
                <h3 className="text-lg font-bold self-start mb-4">Status Code Dist.</h3>
                <div className="h-[250px] w-full">
                  {metrics.statusDist.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No distribution records.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={metrics.statusDist} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {metrics.statusDist.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {metrics.statusDist.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-400">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Performance List Grid */}
              <div className="lg:col-span-2 bg-[#12111A] border border-violet-500/10 p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">Service Performance Profiles</h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {metrics.servicePerformance.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">No clusters currently logging telemetry runtime speeds.</p>
                  ) : (
                    metrics.servicePerformance.map((service, i) => (
                      <div key={service.id || i} className="flex items-center justify-between p-4 bg-[#0B0A0F] rounded-xl border border-violet-500/5">
                        <div>
                          <p className="text-sm font-medium text-white">{service.name}</p>
                          <p className="text-xs text-gray-500">Route: <span className="text-violet-400/80">{service.frontendPath}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-violet-400">{service.avgLatency}ms</p>
                          <p className="text-xs text-gray-500">Avg. Latency</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="p-6 bg-violet-600/10 text-violet-500 rounded-full mb-4">
              <Zap size={48} />
            </div>
            <h2 className="text-2xl font-bold capitalize">{activePage} Section</h2>
            <p className="text-gray-400 mt-2">The {activePage} provisioning module is currently being optimized.</p>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;