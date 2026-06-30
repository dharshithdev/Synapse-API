import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ShieldAlert, ArrowRight, ToggleLeft, ToggleRight, Loader2, ExternalLink, Key, Copy, Check, X } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Verify from '../Security/VerifyUser';
import Footer from '../Components/Footer';

const ServicesPage = () => {
    Verify();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState(''); 
    
    // Success State to reveal the secure backend token after creation
    const [createdKey, setCreatedKey] = useState('');
    const [copied, setCopied] = useState(false);
    
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState('services');
    const [formData, setFormData] = useState({ name: '', frontendPath: '', targetUrl: '', rateLimit: 10 });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('synapse_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/actions/services`, { 
                headers: getAuthHeaders() 
            });
            const data = await res.json();
            if (res.ok) setServices(data);
        } catch (err) {
            setError('Could not establish synchronization connection with Synapse network.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchServices(); 
    }, []);

    const handleCreateService = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/actions/services`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Provisioning sequence failure.');

            setServices([...services, data]);
            
            // Capture the backend generated secure key to show the user
            setCreatedKey(data.apiKey); 
            setFormData({ name: '', frontendPath: '', targetUrl: '', rateLimit: 60 });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCopyKey = () => {
        navigator.clipboard.writeText(createdKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCreatedKey(''); // Clean token flash cache
        setError('');
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/actions/services/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isActive: !currentStatus })
            });
            if (res.ok) {
                setServices(services.map(s => s._id === id ? { ...s, isActive: !currentStatus } : s));
            }
        } catch (err) {
            console.error('Failed to change configuration pipeline state.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you absolutely certain you want to purge this gateway proxy configuration?')) return;
        setError('');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard-mgmt/actions/services/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (res.ok) {
                setServices(services.filter(s => s._id !== id));
            } else {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to dismantle server resource tunnel.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0A0F] text-white flex select-none font-sans antialiased">
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 min-h-screen bg-[#0B0A0F] transition-all duration-300">
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-violet-500/10 pb-6">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Proxy Routing <span className="text-violet-500">Clusters</span>
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Map routes, enforce rate rules, and deploy live reverse proxy layers.</p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/20 font-medium text-sm self-start sm:self-auto"
                        >
                            <Plus size={18} /> Provision Endpoint
                        </button>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium shadow-xl">
                            <ShieldAlert size={18} className="shrink-0 text-red-500" /> 
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-28 gap-3 text-gray-400 bg-[#12111A] rounded-2xl border border-violet-500/5 shadow-inner">
                            <Loader2 size={32} className="animate-spin text-violet-500" />
                            <p className="text-sm font-medium text-gray-400">Mapping active cluster configurations...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="text-center py-24 border border-dashed border-violet-500/10 rounded-2xl bg-[#12111A]/40 flex flex-col items-center justify-center">
                            <p className="text-gray-400 font-medium">No live infrastructure tunnels active.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {services.map((service) => (
                                <div 
                                    key={service._id} 
                                    className={`bg-[#12111A] border rounded-2xl p-6 transition-all shadow-2xl hover:border-violet-500/30 group ${service.isActive ? 'border-violet-500/10' : 'border-gray-800 opacity-50'}`}
                                >
                                    <div className="flex justify-between items-start gap-4 mb-5">
                                        <div className="cursor-pointer flex-1" onClick={() => navigate(`/services/${service._id}`)}>
                                            <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-violet-400 transition-colors flex items-center gap-2">
                                                {service.name} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all text-violet-500" />
                                            </h4>
                                            <span className="inline-flex items-center mt-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                                Limits: {service.rateLimit} req/min
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => toggleStatus(service._id, service.isActive)} className="text-gray-400 hover:text-violet-400 transition-colors">
                                                {service.isActive ? <ToggleRight size={32} className="text-violet-500" /> : <ToggleLeft size={32} />}
                                            </button>
                                            <button onClick={() => handleDelete(service._id)} className="text-gray-500 hover:text-red-400 transition-colors p-2 bg-[#1A1926] hover:bg-red-950/30 rounded-xl border border-transparent hover:border-red-500/20">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-[#0B0A0F] border border-violet-500/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
                                        <div className="w-full md:w-auto">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Gateway Entry</span>
                                            <code className="text-violet-400 font-mono font-bold break-all bg-[#12111A] px-2 py-1 rounded border border-violet-500/5">{service.frontendPath}</code>
                                        </div>
                                        <ArrowRight size={16} className="text-violet-500/30 rotate-90 md:rotate-0 my-1 md:my-0" />
                                        <div className="w-full md:w-auto text-left md:text-right">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Upstream Target</span>
                                            <code className="text-gray-300 font-mono text-xs break-all bg-[#12111A] px-2 py-1 rounded border border-white/5">{service.targetUrl}</code>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Layer */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#12111A] border border-violet-500/20 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-white relative">
                        
                        <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        {/* CONDITIONAL SUB-VIEW: IF BACKEND KEY JUST GENERATED */}
                        {createdKey ? (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 text-sm font-semibold">
                                    <Key size={18} /> Provisioning sequence complete!
                                </div>
                                <h3 className="text-xl font-bold tracking-tight text-white">Cluster Edge Access Token</h3>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Copy this token now. For cluster integrity protection, this key string won't be displayed directly in cleartext on the dashboard page layout again.
                                </p>
                                
                                <div className="bg-[#0B0A0F] border border-violet-500/10 rounded-xl p-3 flex items-center justify-between gap-4 font-mono text-xs mt-2">
                                    <span className="text-violet-400 break-all select-all font-semibold select-text">{createdKey}</span>
                                    <button 
                                        onClick={handleCopyKey}
                                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-xs font-medium text-white transition-all shadow-md"
                                    >
                                        {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
                                        <span>{copied ? 'Copied' : 'Copy Key'}</span>
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-gray-800 mt-4">
                                    <button onClick={handleCloseModal} className="w-full bg-[#1A1926] border border-gray-800 text-gray-300 hover:text-white rounded-xl py-2.5 text-sm font-medium transition-all">
                                        Done & Return to Main Hub
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* DEFAULT PROVISION FORM SUBMISSION VIEW */
                            <>
                                <h3 className="text-xl font-bold tracking-tight text-white">Provision Upstream Endpoint</h3>
                                <form onSubmit={handleCreateService} className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Service Reference Identity</label>
                                        <input type="text" required placeholder="e.g., ABCD Production Backend" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Proxy Intercept Path</label>
                                            <input type="text" required placeholder="e.g., /api/abcd" value={formData.frontendPath} onChange={(e) => setFormData({...formData, frontendPath: e.target.value})} className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rate Window (RPM)</label>
                                            <input type="number" required min="1" value={formData.rateLimit} onChange={(e) => setFormData({...formData, rateLimit: parseInt(e.target.value) || 10})} className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Absolute Destination Target URL</label>
                                        <input type="url" required placeholder="https://abcd-api.onrender.com" value={formData.targetUrl} onChange={(e) => setFormData({...formData, targetUrl: e.target.value})} className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all" />
                                    </div>
                                    <div className="flex gap-3 pt-5 mt-4 border-t border-gray-800">
                                        <button type="button" onClick={handleCloseModal} className="w-1/2 bg-[#1A1926] border border-gray-800 text-gray-300 rounded-xl py-2.5 text-sm font-medium">Cancel</button>
                                        <button type="submit" className="w-1/2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-2.5 text-sm font-medium shadow-lg shadow-violet-600/20">
                                            Confirm & Generate API Key
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;