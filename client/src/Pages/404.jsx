import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Home } from 'lucide-react';
import Header from '../Components/Header';
import Footer2 from '../Components/Footer2';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07060A] text-white flex flex-col overflow-x-hidden relative">
      
      {/* 🔮 Soft Ambient Glow Backgrounds */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full" />
        <div className="absolute top-[40%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-fuchsia-600/5 blur-[90px] rounded-full" />
      </div>

      <Header />

      {/* --- Main Content --- */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 pt-36 pb-16 text-center max-w-xl mx-auto w-full">
        
        {/* Soft Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-semibold text-violet-400 mb-6 backdrop-blur-md">
          <HelpCircle size={14} /> Page Not Found
        </div>

        {/* Big Clean 404 Header */}
        <h1 className="text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-white/20 select-none leading-none">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mt-6 tracking-tight">
          Looks like you're lost in space
        </h2>
        
        <p className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed">
          The page you are looking for doesn't exist, has been moved, or the link might be broken. Let's get you back on track.
        </p>

        {/* --- Action Buttons --- */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-[#12111A] border border-white/5 hover:border-violet-500/20 text-gray-300 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10"
          >
            <Home size={16} /> Home Base
          </button>
        </div>

      </main>

      <Footer2 />
    </div>
  );
};

export default NotFound;