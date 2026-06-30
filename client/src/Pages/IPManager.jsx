import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Globe, CheckCircle, Ban, Loader2, LayoutDashboard, Terminal, Settings, Menu, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Verify from '../Security/VerifyUser'

const IpManager = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  Verify();
  // Custom Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, targetId: null });
  
  // Form State
  const [formData, setFormData] = useState({
    ipAddress: '',
    ruleType: 'blacklist',
    description: ''
  });

  // Fetch rules from Gateway API
  const fetchRules = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('synapse_token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/ip/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRules(data.rules);
      } else {
        throw new Error(data.message || 'Failed to fetch rules');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('synapse_token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/ip/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        setRules([data.rule, ...rules]);
        setFormData({ ipAddress: '', ruleType: 'blacklist', description: '' });
      } else {
        throw new Error(data.message || 'Failed to add configuration rule.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Triggers the custom confirmation modal layout
  const confirmDelete = (id) => {
    setDeleteModal({ show: true, targetId: id });
  };

  // Executes actual deletion if confirmed inside modal
  const handleDelete = async () => {
    const id = deleteModal.targetId;
    if (!id) return;
    
    try {
      const token = localStorage.getItem('synapse_token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/ip/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRules(rules.filter(rule => rule._id !== id));
      }
    } catch (err) {
      setError('Failed to purge IP signature profile.');
    } finally {
      setDeleteModal({ show: false, targetId: null });
    }
  };

  return (
    <div className="min-h-screen bg-[#07060A] text-white flex font-sans relative overflow-x-hidden">
      
      {/* 🔮 Deep Ambient Glow Canvas Blurs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-violet-600/5 blur-[130px] rounded-full" />
        <div className="absolute top-[60%] right-[10%] w-[350px] h-[350px] bg-fuchsia-600/5 blur-[120px] rounded-full" />
      </div>

      {/* --- DASHBOARD SIDEBAR NAVIGATION --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0E0C15] border-r border-white/5 pt-6 px-4 flex flex-col justify-between transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />

        {/* Dynamic User Profile Quick Tag */}
        <div className="border-t border-white/5 py-4 mb-2 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-mono text-xs font-bold text-violet-400">
            SY
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">Tenant Cluster</p>
            <p className="text-[10px] text-gray-500 truncate">active_node@edge.com</p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CORE PANEL CONTENT SPACE --- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        
        {/* Top Navbar Header Trigger */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#0E0C15]/80 border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <img src="/sy3.png" alt="Logo" className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">SYNAPSE<span className="text-violet-500">.API</span></span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
        </header>

        {/* Content Box Wrapper */}
        <main className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-8 flex-grow">
          
          {/* Section Functional Breadcrumbs */}
          <div className="flex items-center gap-3 border-b border-white/5 pb-5">
            <div className="p-2.5 bg-violet-600/10 border border-violet-500/20 rounded-xl text-violet-400">
              <Shield size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Proxy IP Firewall</h1>
              <p className="text-sm text-gray-400">Control structural access limits across active edge layers</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Form: Add New Rule Container */}
            <form onSubmit={handleSubmit} className="bg-[#12111A] border border-white/5 p-6 rounded-2xl space-y-4 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">New Access Node Rule</h3>
              
              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Target IP Address</label>
                <input
                  type="text"
                  name="ipAddress"
                  required
                  value={formData.ipAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 192.168.1.1"
                  className="w-full bg-[#1A1926] border border-white/5 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Rule Policy Status</label>
                <select
                  name="ruleType"
                  value={formData.ruleType}
                  onChange={handleInputChange}
                  className="w-full bg-[#1A1926] border border-white/5 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all cursor-pointer"
                >
                  <option value="blacklist">Blacklist (Block Request)</option>
                  <option value="whitelist">Whitelist (Authorize Access Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 font-medium mb-1.5">Reference Note Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Block scraping server instance"
                  className="w-full bg-[#1A1926] border border-white/5 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-violet-600 hover:bg-violet-700 transition-colors py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/10 disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
                Deploy Rule Profile
              </button>
            </form>

            {/* Right Layout: Active Configurations Table List */}
            <div className="lg:col-span-2 bg-[#12111A]/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Deployed Policy Arrays</h3>
                <span className="text-xs bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-gray-400 font-mono">
                  Count: {rules.length}
                </span>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
                  <Loader2 className="animate-spin text-violet-500" size={24} />
                  Loading synchronized rules...
                </div>
              ) : rules.length === 0 ? (
                <div className="py-20 text-center text-gray-500 text-sm font-medium flex flex-col items-center gap-2">
                  <Globe size={28} className="opacity-40 text-violet-400" />
                  No protection policies deployed to the edge cluster.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-xs text-gray-400 uppercase font-semibold">
                        <th className="px-6 py-3.5">IP Node Coordinates</th>
                        <th className="px-6 py-3.5">Policy Status</th>
                        <th className="px-6 py-3.5">Reference Parameters</th>
                        <th className="px-6 py-3.5 text-right">Cluster Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {rules.map((rule) => (
                        <tr key={rule._id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="px-6 py-4 font-mono text-white text-xs">{rule.ipAddress}</td>
                          <td className="px-6 py-4">
                            {rule.ruleType === 'whitelist' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg">
                                <CheckCircle size={12} /> Whitelist
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-lg">
                                <Ban size={12} /> Blacklist
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-400 max-w-[180px] truncate text-xs">{rule.description || '—'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => confirmDelete(rule._id)}
                              className="p-1.5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all opacity-80 group-hover:opacity-100"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* --- 🛠️ MODAL OVERLAY: CUSTOM CONFIRMATION DIALOG --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* Blur Backdrop Trigger */}
          <div 
            onClick={() => setDeleteModal({ show: false, targetId: null })}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />

          {/* Dialog Container Base */}
          <div className="relative w-full max-w-sm bg-[#12111A] border border-red-500/20 rounded-2xl p-6 shadow-2xl shadow-black/80 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              
              {/* Alert Sign Icon Element */}
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-4 animate-bounce">
                <AlertTriangle size={24} />
              </div>

              <h3 className="text-md font-bold text-white tracking-tight">Revoke Firewall Policy?</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                This action instantly purges the IP access rules from your cluster firewall. Dropped paths will immediately be exposed to standard open tracking logic.
              </p>

              {/* Functional Interaction Buttons Actions */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  onClick={() => setDeleteModal({ show: false, targetId: null })}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl py-2.5 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-red-600/10 transition-colors"
                >
                  Confirm Drop
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default IpManager;