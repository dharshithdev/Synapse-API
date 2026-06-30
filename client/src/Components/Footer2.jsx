import React from 'react';
import { ArrowUpRight, ShieldCheck, Terminal, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer2 = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-t from-[#0E0C15] to-[#07060A] border-t border-white/5 relative overflow-hidden">
      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Branding & Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/5">
          
          {/* Column 1: Core Brand Pitch */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/sy3.png" 
                alt="Synapse API Logo" 
                className="w-7 h-7 object-contain" 
              />
              <span className="text-lg font-bold text-white tracking-tight">
                SYNAPSE<span className="text-violet-500">.API</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Empowering developers with atomic-precision traffic control. Secure your microservices, cache intelligent workflows, and monitor distributed architecture metrics instantly.
            </p>
          </div>

          {/* Column 2: Quick Platform Map */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#features" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                  Core Features <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                  Privacy <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <Link to="/verify" className="hover:text-violet-400 transition-colors">
                  System Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Protocols */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">System Identity</h4>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-medium text-emerald-400">
                <ShieldCheck size={14} /> Edge Encryption Verified
              </div>
              <p className="text-xs text-gray-500 max-w-[200px] leading-normal">
                Distributed routing protocols synchronized across active edge proxies.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright & Engineering Tag */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Copyright notice - Balanced and Centered for Landing Layouts */}
          <p className="text-xs text-gray-500 tracking-wide">
            &copy; {currentYear} SYNAPSE.API. All rights reserved. Precision reverse proxy infrastructure.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer2;