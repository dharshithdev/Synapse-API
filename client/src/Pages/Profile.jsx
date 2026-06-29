import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, Trash2, AlertTriangle, Loader2, Save, RefreshCw, KeyRound, Server } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import Verify from '../Security/VerifyUser';
import api from '../Security/AxiosConfig';
import Footer from '../Components/Footer';

const Profile = () => {
    Verify();
    const navigate = useNavigate();
    
    // Server states
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Input States
    const [infoForm, setInfoForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    
    // Danger Zone Modal state
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [confirmStringInput, setConfirmStringInput] = useState('');

    // Sidebar/Layout states
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState('profile');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('synapse_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/account/profile`, {
                    headers: getAuthHeaders()
                });
                const data = await res.json();
                if (res.ok) {
                    setProfileData(data);
                    setInfoForm({ name: data.user.name, email: data.user.email });
                } else {
                    setError(data.message || 'Identity authorization mapping sync breakdown.');
                }
            } catch (err) {
                setError('Failed to establish contact with account telemetry grids.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:5000/api/account/profile', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(infoForm)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update metadata parameters.');
            
            setSuccess('Identity access profiles updated successfully.');
            setProfileData(prev => ({ ...prev, user: { ...prev.user, ...infoForm } }));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('System mismatch matching new credentials passwords.');
            return;
        }

        setActionLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:5000/api/account/profile', {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Credential generation cycle fault.');

            setSuccess('Cryptographic password credentials updated successfully.');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handlePurgeAccount = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/account/profile', {
                method: 'DELETE',
                headers: getAuthHeaders(),
                body: JSON.stringify({ verificationString: confirmStringInput })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Cascade deletion rejected by security node.');

            // Success: Clean token mapping cache and evacuate user context to login root
            localStorage.removeItem('synapse_token');
            localStorage.removeItem('synapse_user');
            navigate('/verify');
        } catch (err) {
            setError(err.message);
            setIsPurgeModalOpen(false);
        } finally {
            setActionLoading(false);
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

            {/* ================= MAIN INTERFACE PANEL ================= */}
            <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 min-h-screen bg-[#0B0A0F] transition-all duration-300">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-400 bg-[#12111A] rounded-2xl border border-violet-500/5">
                        <Loader2 size={32} className="animate-spin text-violet-500" />
                        <p className="text-sm mt-3 font-medium">Syncing account parameter configurations...</p>
                    </div>
                ) : (
                    <div className="max-w-4xl space-y-6">
                        
                        {/* Header Blocks */}
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white">
                                Identity & <span className="text-violet-500">Node Credentials</span>
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Configure global server access settings, security authorizations, and control profile tags.</p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-sm font-medium shadow-xl">
                                <AlertTriangle size={18} className="shrink-0 text-red-500" /> 
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3 text-sm font-medium shadow-xl">
                                <ShieldCheck size={18} className="shrink-0 text-emerald-500" /> 
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Telemetry Extra Metrics Info Banner */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="bg-[#12111A] border border-violet-500/10 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400"><Server size={20} /></div>
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Assigned Proxies</span>
                                    <span className="text-lg font-bold font-mono text-white mt-0.5">{profileData?.metrics.totalClusters} Clusters</span>
                                </div>
                            </div>
                            <div className="bg-[#12111A] border border-violet-500/10 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400"><ShieldCheck size={20} /></div>
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Access Clearance</span>
                                    <span className="text-sm font-bold text-violet-400 font-mono mt-0.5">{profileData?.user.role}</span>
                                </div>
                            </div>
                            <div className="bg-[#12111A] border border-violet-500/10 p-5 rounded-2xl flex items-center gap-4">
                                <div className="p-3 bg-violet-600/10 rounded-xl text-violet-400"><KeyRound size={20} /></div>
                                <div>
                                    <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Node Integrity</span>
                                    <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{profileData?.metrics.securityLevel}</span>
                                </div>
                            </div>
                        </div>

                        {/* Core Form Parameters split layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Form Box 1: Core Meta Profiling */}
                            <div className="bg-[#12111A] border border-violet-500/5 rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                                    <User size={18} className="text-violet-400" />
                                    <h3 className="font-bold text-base">Node Parameters</h3>
                                </div>
                                <form onSubmit={handleUpdateInfo} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Developer Handle Identity</label>
                                        <input type="text" required value={infoForm.name} onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Route Intercept Email Alias</label>
                                        <input type="email" required value={infoForm.email} onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all" />
                                    </div>
                                    <button type="submit" disabled={actionLoading} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md shadow-violet-600/10">
                                        <Save size={14} /> Commit Changes
                                    </button>
                                </form>
                            </div>

                            {/* Form Box 2: Auth Cryptography Mutation */}
                            <div className="bg-[#12111A] border border-violet-500/5 rounded-2xl p-6 shadow-xl space-y-4">
                                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                                    <Lock size={18} className="text-violet-400" />
                                    <h3 className="font-bold text-base">Change Credential</h3>
                                </div>
                                <form onSubmit={handleUpdatePassword} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Password</label>
                                        <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2 text-sm outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New Password</label>
                                        <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2 text-sm outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confirm New Password</label>
                                        <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full bg-[#0B0A0F] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-2 text-sm outline-none transition-all" />
                                    </div>
                                    <button type="submit" disabled={actionLoading} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-50">
                                        <RefreshCw size={14} className={actionLoading ? "animate-spin" : ""} /> Change Password
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* ================= GITHUB STYLE DANGER ZONE ================= */}
                        <div className="border border-red-500/20 rounded-2xl bg-red-950/5 overflow-hidden shadow-2xl">
                            <div className="bg-red-950/20 border-b border-red-500/20 px-6 py-4 flex items-center gap-3 text-red-400">
                                <AlertTriangle size={20} className="text-red-500" />
                                <h3 className="font-bold tracking-tight text-base">Danger Infrastructure Zone</h3>
                            </div>
                            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#12111A]/40">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-white">Delete System Node Account</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
                                        Irreversibly dismantles your administrative authority node identity, cleartext access signatures, and terminates synchronization loops. This operation cannot be unrolled.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setIsPurgeModalOpen(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 hover:border-red-500 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white transition-all text-xs font-bold shrink-0 self-start md:self-auto"
                                >
                                    <Trash2 size={14} /> Delete Account
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </main>

            {/* ================= PURGE VERIFICATION MODAL ================= */}
            {isPurgeModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#12111A] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white relative animate-scaleUp">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight text-white">Absolute Purge Sequence Block</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                You are initializing an irreversible database wipe execution. This will fully terminate your account authority pipelines.
                            </p>
                        </div>

                        <form onSubmit={handlePurgeAccount} className="space-y-4 mt-5">
                            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400 leading-normal">
                                To proceed with the deletion execution, please manually type your email token signature <code className="text-red-400 font-mono font-bold font-semibold select-all">{profileData?.user.email}</code> in the container block below:
                            </div>
                            
                            <input 
                                type="text" 
                                required
                                placeholder="Type email to verify node purge"
                                value={confirmStringInput} 
                                onChange={(e) => setConfirmStringInput(e.target.value)} 
                                className="w-full bg-[#0B0A0F] border border-red-500/20 focus:border-red-500 text-red-400 font-mono rounded-xl px-4 py-2.5 text-xs outline-none transition-all"
                            />

                            <div className="flex gap-3 pt-3">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsPurgeModalOpen(false); setConfirmStringInput(''); }} 
                                    className="w-1/2 bg-[#1A1926] border border-gray-800 text-gray-300 rounded-xl py-2.5 text-xs font-medium"
                                >
                                    Abort Purge
                                </button>
                                <button 
                                    type="submit"
                                    disabled={confirmStringInput !== profileData?.user.email || actionLoading}
                                    className="w-1/2 bg-red-600 hover:bg-red-700 disabled:opacity-20 text-white rounded-xl py-2.5 text-xs font-bold shadow-lg shadow-red-600/10 flex items-center justify-center gap-1.5"
                                >
                                    {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    Permentatly Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;