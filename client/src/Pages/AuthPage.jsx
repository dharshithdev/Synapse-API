import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Components/Header';
import Footer2 from '../Components/Footer2';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [agreed, setAgreed] = useState(false);
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

        if (!isLogin && !agreed) {
            setError('You must agree to the Terms of Service and Privacy Policy to proceed.');
            return;
        }

        setLoading(true);

        const endpoint = isLogin ? '/api/verify/login' : '/api/verify/register';
        const payload = isLogin 
            ? { email: formData.email, password: formData.password }
            : formData;

        try {
            // Update port matching your gateway configuration (Port 5000)
            const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
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
            navigate('/dashboard');
            window.location.reload(); // Quick state refresh trigger
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-[#0B0A0F] px-4 font-sans relative">
            
            {/* 📥 Fixed liquid-glass header component mounted at the absolute top */}
            <Header />

            {/* Main Center Area: Perfectly isolates the authentication box below the navigation plane */}
            <div className="flex-grow flex items-center justify-center pt-28 pb-12 w-full">
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

                        {/* Legal Conditions Overlay */}
                        {!isLogin && (
                            <div className="flex items-start gap-3 pt-1">
                                <input
                                    type="checkbox"
                                    id="legal-agree"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 accent-violet-600 w-4 h-4 rounded cursor-pointer"
                                />
                                <label htmlFor="legal-agree" className="text-xs text-gray-400 leading-normal cursor-pointer select-none">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-violet-400 hover:text-violet-300 font-semibold underline transition-colors">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link to="/privacy" className="text-violet-400 hover:text-violet-300 font-semibold underline transition-colors">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-medium rounded-xl py-3 shadow-lg shadow-violet-600/20 transition-all transform active:scale-[0.99] disabled:opacity-50"
                        >
                            {loading ? 'Processing Instance...' : isLogin ? 'Log-In' : 'Sign-Up'}
                        </button>
                    </form>

                    {/* State Switcher */}
                    <div className="text-center mt-6">
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); setAgreed(false); }}
                            className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an environment? Sign In'}
                        </button>
                    </div>

                </div>
            </div>

            {/* 📥 Floating bottom anchor container hosting the landing page footer */}
            <div className="w-full mt-auto">
                <Footer2 />
            </div>

        </div>
    );
};

export default AuthPage;