import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, RefreshCw, Activity, Terminal, Shield, Check, Copy, AlertTriangle, Settings2, Save } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Verify from '../Security/VerifyUser'
import Footer from '../Components/Footer';

const ServiceDetail = () => {
    Verify();
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Configuration Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', targetUrl: '', rateLimit: 60 });
    const [updateLoading, setUpdateLoading] = useState(false);
    
    // Layout UI States
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState('services');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('synapse_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    };

    const fetchServiceDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/dashboard-mgmt/actions/services/${id}`, {
                headers: getAuthHeaders()
            });
            const result = await res.json();
            if (res.ok) {
                setData(result);
                // Pre-populate the update forms cache
                setEditForm({
                    name: result.service.name,
                    targetUrl: result.service.targetUrl,
                    rateLimit: result.service.rateLimit
                });
            } else {
                setError(result.message || 'Failed to sync resource telemetry.');
            }
        } catch (err) {
            setError('Network anomaly prevented cluster synchronization.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    const handleUpdateConfig = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const res = await fetch(`http://localhost:5000/api/dashboard-mgmt/actions/services/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(editForm)
            });
            const updatedDoc = await res.json();

            if (res.ok) {
                // Update the state layout without forcing a refresh
                setData(prev => ({
                    ...prev,
                    service: updatedDoc
                }));
                setIsEditing(false);
                setSuccessMessage('Cluster configurations reassigned successfully.');
                setTimeout(() => setSuccessMessage(''), 4000);
            } else {
                throw new Error(updatedDoc.message || 'Configuration tuning failure.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCopyKey = () => {
        if (!data) return;
        navigator.clipboard.writeText(data.analytics.apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0B0A0F] text-white flex select-none font-sans antialiased">
            <Sidebar 
                isOpen={isSidebarOpen} 
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
                activePage={activePage}
                setActivePage={(page) => {
                    setActivePage(page);
                    navigate('/services');
                }}
            />

            <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 min-h-screen bg-[#0B0A0F] transition-all duration-300">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400 bg-[#12111A] rounded-2xl border border-violet-500/5">
                        <RefreshCw size={32} className="animate-spin text-violet-500" />
                        <p className="text-sm mt-3">Fetching real-time endpoint cluster pipeline data...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-950/40 border border-red-500/30 text-red-400 rounded-2xl flex items-center gap-4">
                        <AlertTriangle size={24} className="text-red-500" />
                        <div>
                            <h4 className="font-bold">Telemetry Error</h4>
                            <p className="text-sm text-gray-400 mt-0.5">{error}</p>
                            <button onClick={() => navigate('/services')} className="text-xs text-violet-400 underline mt-2 block">Return to Cluster Index</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        
                        {/* Success Notification Alert */}
                        {successMessage && (
                            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3 text-sm font-medium shadow-xl animate-fadeIn">
                                <Check size={18} className="shrink-0 text-emerald-500" /> 
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {/* Top Action Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-violet-500/10 pb-5">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => navigate('/services')}
                                    className="p-2 bg-[#12111A] hover:bg-[#1A1926] border border-violet-500/10 hover:border-violet-500/30 rounded-xl text-gray-400 hover:text-white transition-all"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <div className="flex items-center gap-2.5">
                                        <h2 className="text-2xl font-bold tracking-tight text-white">{data.service.name}</h2>
                                        <span className={`w-2 h-2 rounded-full ${data.service.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono mt-1">ID: {data.service._id}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium self-start sm:self-auto ${isEditing ? 'bg-[#1A1926] border-gray-700 text-gray-400 hover:text-white' : 'bg-violet-600 hover:bg-violet-700 text-white border-transparent shadow-lg shadow-violet-600/20'}`}
                            >
                                <Settings2 size={16} />
                                {isEditing ? 'Cancel Configuration' : 'Tune Settings'}
                            </button>
                        </div>

                        {/* EDITABLE SETTINGS FORM LAYOUT */}
                        {isEditing ? (
                            <div className="bg-[#12111A] border border-violet-500/20 rounded-2xl p-6 shadow-xl animate-slideDown">
                                <h3 className="text-base font-bold text-white mb-4">Reconfigure Routing Node</h3>
                                <form onSubmit={handleUpdateConfig} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Service Reference Identity</label>
                                            <input type="text" required value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Rate Limit Window (RPM)</label>
                                            <input type="number" required min="1" value={editForm.rateLimit} onChange={(e) => setEditForm({...editForm, rateLimit: parseInt(e.target.value) || 60})} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Absolute Destination Target URL</label>
                                        <input type="url" required value={editForm.targetUrl} onChange={(e) => setEditForm({...editForm, targetUrl: e.target.value})} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm font-mono outline-none transition-all" />
                                    </div>
                                    <div className="flex justify-end pt-3">
                                        <button 
                                            type="submit" 
                                            disabled={updateLoading}
                                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition-all font-medium text-sm disabled:opacity-50"
                                        >
                                            {updateLoading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                            Commit Parameter Rewrite
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : null}

                        {/* Quick Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-[#12111A] border border-violet-500/10 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400"><Activity size={20} /></div>
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Active Stream Loops</span>
                                    <span className="text-xl font-bold font-mono text-white mt-0.5">{data.analytics.activeConnections} Threads</span>
                                </div>
                            </div>
                            <div className="bg-[#12111A] border border-violet-500/10 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400"><Shield size={20} /></div>
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Interceptor Latency</span>
                                    <span className="text-xl font-bold font-mono text-white mt-0.5">{data.analytics.latency}</span>
                                </div>
                            </div>
                            <div className="bg-[#12111A] border border-violet-500/10 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400"><Terminal size={20} /></div>
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Intercept Error Margin</span>
                                    <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{data.analytics.errorRate}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Static Configuration Summary */}
                        <div className="bg-[#12111A] border border-violet-500/5 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
                            <div className="w-full md:w-auto">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Gateway Entry Path</span>
                                <code className="text-violet-400 font-mono font-bold break-all bg-[#0B0A0F] px-2.5 py-1 rounded border border-violet-500/10">{data.service.frontendPath}</code>
                            </div>
                            <div className="w-full md:w-auto text-left md:text-right">
                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Target Upstream Loop ({data.service.rateLimit} RPM Max)</span>
                                <code className="text-gray-300 font-mono text-xs break-all bg-[#0B0A0F] px-2.5 py-1 rounded border border-white/5">{data.service.targetUrl}</code>
                            </div>
                        </div>

                        {/* Gateway Token Credentials Container */}
                        <div className="bg-[#12111A] border border-violet-500/10 rounded-2xl p-6 space-y-4 shadow-xl">
                            <div className="flex items-center gap-2.5">
                                <Key size={18} className="text-violet-400" />
                                <h3 className="text-base font-bold text-white">Client Edge API Authentication Token</h3>
                            </div>
                            <p className="text-gray-400 text-xs leading-relaxed max-w-2xl">
                                Provide this secure header token mapping inside your frontend application environment settings. Pass this value explicitly under the key identifier name <code className="text-violet-400 px-1 py-0.5 bg-[#0B0A0F] rounded border border-violet-500/5 font-mono">x-api-key</code>.
                            </p>
                            <div className="bg-[#0B0A0F] border border-violet-500/5 rounded-xl p-3 flex items-center justify-between gap-4 font-mono text-xs">
                                <span className="text-gray-400 break-all select-all font-semibold tracking-tight">{data.analytics.apiKey}</span>
                                <button 
                                    onClick={handleCopyKey}
                                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#12111A] border border-violet-500/10 hover:border-violet-500/30 rounded-lg text-xs text-gray-300 hover:text-white transition-all"
                                >
                                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                    <span>{copied ? 'Copied' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Metrics Graph */}
                        <div className="bg-[#12111A] border border-violet-500/10 rounded-2xl p-6">
                            <h3 className="text-base font-bold text-white mb-4">Pipeline Load Metrics (RPM Trend)</h3>
                            <div className="h-28 flex items-end gap-2 pt-4 px-2 border-b border-gray-800">
                                {data.analytics.requestsOverTime.map((val, idx) => (
                                    <div 
                                        key={idx} 
                                        style={{ height: `${(val / 80) * 100}%` }} 
                                        className="w-full bg-gradient-to-t from-violet-600/40 to-violet-500 rounded-t-md hover:brightness-125 transition-all relative group cursor-pointer"
                                    >
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0B0A0F] text-[10px] font-mono px-1.5 py-0.5 rounded border border-violet-500/20 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider px-1">
                                <span>10m ago</span>
                                <span>5m ago</span>
                                <span>Just Now</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ServiceDetail;