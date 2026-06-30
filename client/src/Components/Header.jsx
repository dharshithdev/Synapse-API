import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  
  const hasToken = localStorage.getItem('synapse_user');

  // Listen to window scroll mechanics to trigger shrinking thresholds
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-500 ease-out">
      <nav 
        className={`mx-auto transition-all duration-500 ease-out rounded-2xl
          ${isScrolled 
            ? 'max-w-5xl bg-[#12111A]/40 border-violet-500/20 shadow-[0_8px_32px_0_rgba(124,58,237,0.1)]' 
            : 'max-w-7xl bg-[#0B0A0F]/20 border-violet-500/5'
          } 
          backdrop-blur-xl border border-white/5 flex flex-col justify-center`}
        style={{
          height: isScrolled ? '64px' : '80px'
        }}
      >
        <div className="px-6 flex items-center justify-between w-full">
          
          {/* Logo Identity */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/sy3.png" alt="Synapse Logo" className="w-7 h-7 object-contain" />
            <span className="text-lg font-bold text-white tracking-tight">
              SYNAPSE<span className="text-violet-500">.API</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wide uppercase text-gray-400">
            <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-violet-400 transition-colors">Architecture</a>
            <a href="/docs" className="hover:text-violet-400 transition-colors">Docs</a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {hasToken ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md shadow-violet-600/20"
              >
                Console <Terminal size={14} />
              </button>
            ) : (
              <>
                <Link to="/verify" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                  Sign In
                </Link>
                <Link 
                  to="/verify"
                  className="px-4 py-2 bg-violet-500/10 hover:bg-violet-600 border border-violet-500/30 hover:border-violet-600 text-white text-xs font-bold rounded-xl transition-all duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-5xl mx-auto mt-2 bg-[#0B0A0F]/90 backdrop-blur-2xl border border-violet-500/10 rounded-2xl px-5 py-4 space-y-3 shadow-xl">
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white"
          >
            Features
          </a>
          <a 
            href="#architecture" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-gray-400 hover:text-white"
          >
            Architecture
          </a>
          <div className="pt-3 border-t border-violet-500/5 flex flex-col gap-2">
            <Link 
              to="/verify"
              className="w-full text-center py-2 text-sm border border-violet-500/20 text-gray-300 rounded-xl"
            >
              Sign In
            </Link>
            <Link 
              to="/verify"
              className="w-full text-center py-2 bg-violet-600 text-white text-sm rounded-xl font-medium"
            >
              Launch Console
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;