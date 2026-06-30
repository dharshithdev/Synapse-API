import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Activity, Cpu, ArrowRight, Terminal } from 'lucide-react';
import Header from '../Components/Header';
import AccessDashboard from '../Security/AccessDashboard';
import Footer2 from '../Components/Footer2';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="relative bg-[#110F17]/40 border border-violet-500/5 p-8 rounded-3xl hover:border-violet-500/20 transition-all duration-300 group overflow-hidden backdrop-blur-md">
    {/* Internal glow on hover */}
    <div className="absolute -inset-px bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
    
    <div className="p-3 bg-violet-600/10 border border-violet-500/10 rounded-2xl text-violet-400 w-fit mb-6 group-hover:text-violet-300 transition-colors relative z-10">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed relative z-10">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  AccessDashboard();  
  return (
    <div className="min-h-screen bg-[#07060A] text-white flex flex-col overflow-x-hidden relative">
      
      {/* 🔮 ULTRA GLOW BACKGROUND COMPLEXITY */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[400px] h-[400px] bg-violet-600/10 blur-[140px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-fuchsia-600/5 blur-[120px] rounded-full" />
        {/* Subtle Cyber Grid Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1d29_1px,transparent_1px),linear-gradient(to_bottom,#1f1d29_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />
      </div>

      <Header />

      {/* --- HERO LAYER SECTION --- */}
      <section className="relative z-10 pt-44 pb-20 md:pt-56 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-semibold text-violet-400 mb-6 backdrop-blur-md">
          <Cpu size={12} className="animate-spin [animation-duration:6s]" /> Core v2.0 proxy clusters fully operational
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">
          Orchestrate API Clusters <br />
          With <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-500 to-fuchsia-400">Atomic Precision</span>
        </h1>

        <p className="text-gray-400 text-md md:text-lg max-w-2xl mt-6 leading-relaxed">
          An enterprise-grade reverse proxy layer and API gateway built to secure upstream pipelines using asynchronous Redis cache limit throttlers and distributed telemetry monitors.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
          <button 
            onClick={() => navigate('/verify')}
            className="w-full sm:w-auto px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-violet-600/20 hover:translate-y-[-1px]"
          >
            Launch System Core <ArrowRight size={16} />
          </button>
          <a 
            href="#architecture"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#12111A]/60 border border-violet-500/10 hover:border-violet-500/30 text-gray-300 text-sm font-bold rounded-xl transition-all duration-300 text-center backdrop-blur-md"
          >
            View Architecture
          </a>
        </div>
      </section>

      {/* --- TELEMETRY LOG PREVIEW CONSOLE --- */}
      <section id="architecture" className="relative z-10 max-w-5xl mx-auto px-4 pb-24 w-full">
        <div className="bg-[#12111A]/40 border border-white/5 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              <span className="ml-2 text-gray-400">synapse_engine_telemetry.log</span>
            </div>
            <span className="text-violet-500/60 font-semibold uppercase tracking-widest text-[10px]">Active Node</span>
          </div>
          <div className="bg-[#08070B] rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto text-left space-y-2.5 text-violet-400/80">
            <p className="text-gray-600">{"// Instantiating distributed cluster runtime links..."}</p>
            <p><span className="text-emerald-400 font-bold">⚡ OK</span> Redis Telemetry Throttler cache connected successfully.</p>
            <p><span className="text-emerald-400 font-bold">⚡ OK</span> Synapse Proxy Engine connected to DB Cluster Node: 127.0.0.1</p>
            <p className="text-white bg-violet-950/20 py-1 px-2 rounded border border-violet-500/10 w-fit">
              <span className="text-violet-400 font-bold">➜ PROXY_ROUTER:</span> GET /api/auth via cluster-node-1 <span className="text-emerald-400">[200 OK]</span> - 34ms
            </p>
          </div>
        </div>
      </section>

      {/* --- VALUE FEATURE GRID --- */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Engineered for Massive Scale</h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base">
            Everything required to analyze, configure, and protect upstream server microservices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Zap}
            title="Redis Multi-Throttling"
            description="Protect microservice nodes with smart, atomic request limit counters. Defends cluster targets against traffic surges instantaneously."
          />
          <FeatureCard 
            icon={Shield}
            title="Dynamic Token Isolation"
            description="Verify API security footings via request headers dynamically matching strict cryptographic signatures on database structures."
          />
          <FeatureCard 
            icon={Activity}
            title="Parallel Analytics Facets"
            description="Process aggregate metrics calculations across multi-document logs simultaneously inside MongoDB clusters in under 5ms."
          />
        </div>
      </section>

      {/* --- INTEGRATED FOOTER --- */}
      <div className="relative z-10 mt-auto">
        <Footer2 />
      </div>
    </div>
  );
};

export default Home;