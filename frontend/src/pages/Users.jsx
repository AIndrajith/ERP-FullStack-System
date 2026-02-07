import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserPlus, Shield, Mail, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ email: '', password: '', is_active: true });

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users/');
            setUsers(res.data);
        } catch (err) {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/', newUser);
            toast.success('User created successfully');
            setShowModal(false);
            setNewUser({ email: '', password: '', is_active: true });
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to create user');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Access Control</h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">Manage system users, roles and security permissions.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                    onClick={() => setShowModal(true)}
                >
                    <UserPlus size={18} />
                    <span>Invite User</span>
                </button>
            </div>

            <div className="glass overflow-hidden shadow-2xl shadow-slate-950/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Created Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Security Roles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-indigo-400 font-bold border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                                {u.email[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white">{u.email}</span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail size={10} /> Member since {new Date(u.created_at).getFullYear()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                <CheckCircle size={10} /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                <XCircle size={10} /> Deactivated
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-300 font-medium">
                                            {new Date(u.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {u.roles.map(r => (
                                                <span key={r.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-tighter">
                                                    <Shield size={10} />
                                                    {r.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="glass w-full max-w-md p-8 relative animate-fadeIn shadow-2xl border-white/20">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <UserPlus size={20} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Create Account</h2>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">Work Email</label>
                                <input
                                    type="email"
                                    required
                                    className="bg-slate-900 border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-xl p-3"
                                    placeholder="john.doe@company.com"
                                    value={newUser.email}
                                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="bg-slate-900 border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-xl p-3"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary shadow-lg shadow-indigo-600/20 text-sm font-bold"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
