import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, Shield, Activity, ArrowRight, Menu, X } from 'lucide-react';
import Header from '../Components/Header';
import Footer2 from '../Components/Footer2';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top on section switch
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const menuItems = [
    { id: 'getting-started', title: 'Getting Started', icon: BookOpen },
    { id: 'redis-throttling', title: 'Redis Multi-Throttling', icon: Zap },
    { id: 'token-isolation', title: 'Token Isolation Security', icon: Shield },
    { id: 'telemetry-metrics', title: 'Telemetry Metrics', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#07060A] text-white flex flex-col overflow-x-hidden relative">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] bg-violet-600/5 blur-[120px] rounded-full" />
      </div>

      <Header />

      {/* --- Main Structural Container --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-24 flex-grow w-full lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* --- Mobile Sidebar Toggle Button --- */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-[#12111A] border border-white/5 rounded-xl font-medium text-sm text-gray-300 mb-2"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />} 
          {menuItems.find(item => item.id === activeSection)?.title || 'Browse Topics'}
        </button>

        {/* --- LEFT COLUMN: Documentation Navigation Panel --- */}
        <aside className={`
          fixed inset-0 z-40 bg-[#07060A] pt-32 px-6 lg:pt-0 lg:px-0 lg:relative lg:inset-auto lg:z-0 lg:w-64 shrink-0
          ${mobileMenuOpen ? 'block' : 'hidden lg:block'}
        `}>
          <div className="sticky top-32 space-y-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">Documentation</h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                    ${isActive 
                      ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.title}
                </button>
              );
            })}
          </div>
        </aside>

        {/* --- RIGHT COLUMN: Explanatory Content Engine --- */}
        <main className="flex-1 max-w-3xl bg-[#110F17]/30 border border-white/5 rounded-3xl p-6 md:p-10 backdrop-blur-md min-h-[500px]">
          
          {activeSection === 'getting-started' && (
            <article className="space-y-6">
              <h1 className="text-3xl font-black tracking-tight text-white">Welcome to SYNAPSE.API</h1>
              <p className="text-gray-400 leading-relaxed">
                SYNAPSE.API is a high-performance reverse proxy network layer engineered to connect, secure, and monitor distributed backend systems. By placing our gateway infrastructure in front of your applications, you gain immediate access to institutional-grade security architectures without mutating core codebases.
              </p>
              <div className="p-5 bg-violet-600/5 border border-violet-500/10 rounded-2xl">
                <h4 className="font-bold text-white mb-1">Architecture Objective</h4>
                <p className="text-sm text-gray-400 leading-normal">
                  Our system routes complex internet traffic coordinates smoothly into independent upstream microservice node points while automatically standardizing threat-mitigation defenses.
                </p>
              </div>
            </article>
          )}

          {activeSection === 'redis-throttling' && (
            <article className="space-y-6">
              <h1 className="text-3xl font-black tracking-tight text-white">Redis Multi-Throttling</h1>
              <p className="text-gray-400 leading-relaxed">
                Sudden traffic surges or automated scrape actions can easily overwhelm unshielded target instances. SYNAPSE integrates a lightning-fast asynchronous caching cluster framework dedicated exclusively to real-time request speed evaluation.
              </p>
              <h3 className="text-lg font-bold text-gray-200 mt-4">How it operates:</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-3"><span className="text-violet-500 font-bold">01.</span> Every incoming request queries our volatile cache space inside 1ms.</li>
                <li className="flex gap-3"><span className="text-violet-500 font-bold">02.</span> If the client fingerprint exceeds safe velocity parameters, access is temporarily denied.</li>
                <li className="flex gap-3"><span className="text-violet-500 font-bold">03.</span> These monitoring counters vanish cleanly and automatically when thresholds reset.</li>
              </ul>
            </article>
          )}

          {activeSection === 'token-isolation' && (
            <article className="space-y-6">
              <h1 className="text-3xl font-black tracking-tight text-white">Token Isolation Security</h1>
              <p className="text-gray-400 leading-relaxed">
                Data security demands precise validation boundaries. Our dynamic token isolation mechanisms strip away verification layers from the destination application codebases, executing credential evaluations directly inside the entry-point cloud layer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-white font-bold text-sm mb-1">Header Evaluation</h4>
                  <p className="text-xs text-gray-400">Incoming authorization metadata undergoes automatic parsing verification checks instantly.</p>
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                  <h4 className="text-white font-bold text-sm mb-1">Signature Integrity</h4>
                  <p className="text-xs text-gray-400">Malformed header variables or cracked signatures trigger automated request drops.</p>
                </div>
              </div>
            </article>
          )}

          {activeSection === 'telemetry-metrics' && (
            <article className="space-y-6">
              <h1 className="text-3xl font-black tracking-tight text-white">Telemetry Metrics</h1>
              <p className="text-gray-400 leading-relaxed">
                Operating a reliable network layer requires pristine analytical visibility. SYNAPSE processes parallel telemetry variables behind the scenes, tracking crucial latency spikes and response variations across multiple database components simultaneously.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Rather than causing latency overhead by logging tracking objects individually, your connection metrics aggregate seamlessly inside isolated micro-pipelines, allowing you to examine active server cluster trends under a stable 5ms execution window.
              </p>
            </article>
          )}

        </main>
      </div>

      <Footer2 />
    </div>
  );
};

export default Docs;