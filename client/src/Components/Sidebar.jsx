import React from 'react';
import { LayoutDashboard, Server, User, Menu, X, Zap } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar, activePage, setActivePage }) => {
  const menuItems = [
    { id: 'analyze', name: 'Analyze', icon: LayoutDashboard, path: '/' },
    { id: 'services', name: 'Services', icon: Server, path: '/services' },
    { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("synapse_token");
    localStorage.removeItem("synapse_user");
    window.location.reload();
  };
  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-violet-600 rounded-lg text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full bg-[#12111A] border-r border-violet-500/10 z-40 transition-all duration-300
        ${isOpen ? 'w-64' : 'w-0 lg:w-64 overflow-hidden'}
      `}>
        <div className="p-6 flex items-center gap-3">
  {/* Logo Container */}
          <div className="p-1 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src="/sy3.png" 
              alt="Synapse API Logo" 
              className="w-8 h-8 object-contain" 
            />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            SYNAPSE<span className="text-violet-500">. API</span>
          </span>
        </div>

        <nav className="mt-10 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                ${activePage === item.id 
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6 space-y-3">

          <div className="p-4 bg-violet-600/5 border border-violet-500/10 rounded-2xl">
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-300 font-medium">
                Synapse API
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-600/20 transition-all"
          >
            Log Out
          </button>

        </div>
      </div>
    </>
  );
};

export default Sidebar;