import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

      useEffect(() => {
        const token = localStorage.getItem('synapse_user');
        if (token) {
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/verify/login' : '/api/verify/register';
        const payload = isLogin 
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            // Update port matching your gateway configuration (Port 5000)
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Save state credentials
            localStorage.setItem('synapse_token', data.token);
            localStorage.setItem('synapse_user', JSON.stringify({ name: data.name, email: data.email }));
            
            // Redirect or update global state here
            navigate('/')
            window.location.reload(); // Quick state refresh trigger
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0A0F] px-4 font-sans">
            <div className="w-full max-w-md bg-[#12111A] border border-violet-500/20 rounded-2xl p-8 shadow-2xl shadow-violet-950/20">
                
                {/* Branding Headers */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        SYNAPSE<span className="text-violet-500">.API</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {isLogin ? 'Sign in to manage your gateway infrastructure' : 'Create your tenant gateway cluster account'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-sm rounded-lg">
                        {error}
                        {console.log(error)}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-600"
                                placeholder="Alex Mercer"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-600"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-[#1A1926] border border-violet-500/10 focus:border-violet-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium rounded-xl py-3 shadow-lg shadow-violet-600/20 transition-all transform active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? 'Processing Instance...' : isLogin ? 'Access Dashboard' : 'Provision Infrastructure'}
                    </button>
                </form>

                {/* State Switcher */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : 'Already have an environment? Sign In'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AuthPage;