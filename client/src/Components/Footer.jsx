import React from 'react';
import { ExternalLink, Terminal, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0B0A0F] border-t border-violet-500/10 mt-auto">
      {/* 💡 Adds structural left padding on desktop screens to match the sidebar column offset */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:pl-64 xl:pl-72 lg:pr-8">
        
        {/* Top Segment: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <img 
                  src="/sy3.png" 
                  alt="Synapse API Logo" 
                  className="w-7 h-7 object-contain" 
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                SYNAPSE<span className="text-violet-500">.API</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Next-generation distributed reverse proxy network. Orchestrating secure API traffic routing, lightning-fast Redis caching layers, and microservice throttle metrics with atomic precision.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/dashboard" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                  Dashboard <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                  Cluster Registry <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-violet-400 transition-colors flex items-center gap-1 group">
                  Telemetry Metrics <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Documentation & Help */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#docs" className="hover:text-violet-400 transition-colors">
                  API Blueprint Docs
                </a>
              </li>
              <li>
                <a href="#status" className="hover:text-violet-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Proxy Node Status
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-violet-400 transition-colors">
                  Technical Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider Split */}
        <div className="border-t border-violet-500/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Legal / Copyright details */}
          <p className="text-xs text-gray-500 tracking-wide">
            &copy; {currentYear} SYNAPSE.API. All rights reserved. Built for distributed microservice clusters.
          </p>

          {/* Social Repository Connectivity */}
          <div className="flex items-center gap-2 text-gray-400">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 hover:bg-violet-600/10 hover:text-violet-500 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
              title="GitHub Repository"
            >
              <Terminal size={16} /> Code
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 hover:bg-violet-600/10 hover:text-violet-500 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
              title="Network"
            >
              <Globe size={16} /> Network
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 hover:bg-violet-600/10 hover:text-violet-500 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
              title="Updates"
            >
              <ExternalLink size={16} /> Updates
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;