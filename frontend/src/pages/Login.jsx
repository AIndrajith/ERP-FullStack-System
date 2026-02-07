import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { LayoutDashboard, Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await api.post('/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            login(res.data.user, res.data.access_token, res.data.permissions);
            toast.success('Authentication successful');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Identity verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/5 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-md animate-fadeIn relative">
                <div className="text-center mb-10">
                    <div className="inline-flex w-16 h-16 bg-indigo-600 rounded-2xl items-center justify-center mb-6 shadow-2xl shadow-indigo-600/40 ring-4 ring-white/5">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">ERP Nexus</h1>
                    <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-xs">Enterprise Management System</p>
                </div>

                <div className="glass p-8 md:p-10 shadow-2xl border-white/10 ring-1 ring-white/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Identity Signature</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    className="bg-slate-900 border-white/5 text-white pl-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500/50"
                                    placeholder="admin@enterprise.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Passkey</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    className="bg-slate-900 border-white/5 text-white pl-12 rounded-xl focus:ring-indigo-500/50 focus:border-indigo-500/50"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                        >
                            Authorize Session
                            <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed">
                            Protected by industry-grade encryption. <br />
                            Unauthorized access is strictly monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
