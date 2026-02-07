import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Users, Briefcase, ShoppingCart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [activity, setActivity] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, actRes] = await Promise.all([
                    api.get('/dashboard/summary'),
                    api.get('/dashboard/recent-activity')
                ]);
                setSummary(sumRes.data);
                setActivity(actRes.data);
            } catch (err) {
                toast.error('Failed to load dashboard data');
            }
        };
        fetchData();
    }, []);

    if (!summary) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    const stats = [
        { title: 'Total Users', value: summary.users_count, icon: <Users size={24} />, color: 'bg-indigo-500', trend: '+12%', isUp: true },
        { title: 'Employees', value: summary.employees_count, icon: <Briefcase size={24} />, color: 'bg-emerald-500', trend: '+5%', isUp: true },
        { title: 'Products', value: summary.products_count, icon: <Package size={24} />, color: 'bg-amber-500', trend: '-2%', isUp: false },
        { title: 'Customers', value: summary.customers_count, icon: <ShoppingCart size={24} />, color: 'bg-rose-500', trend: '+18%', isUp: true },
    ];

    return (
        <div className="space-y-10 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Executive Dashboard</h1>
                <p className="text-slate-400 mt-1 font-medium">Real-time overview of your enterprise operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 group hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-xl shadow-lg ring-4 ring-white/5`}>
                                {stat.icon}
                            </div>
                            <span className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.title}</h3>
                        <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inventory Transactions */}
                <div className="glass overflow-hidden shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Activity size={18} className="text-indigo-400" />
                            Inventory Activity
                        </h3>
                        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Action</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Qty</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {activity?.recent_transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-white">{t.product.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    t.type === 'OUT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-300">{t.quantity}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leave Requests */}
                <div className="glass overflow-hidden shadow-2xl">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Briefcase size={18} className="text-emerald-400" />
                            Recent Leave Requests
                        </h3>
                        <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider">Board</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Employee</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">Timeline</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {activity?.recent_leave_requests.map(l => (
                                    <tr key={l.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-white">{l.employee.full_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${l.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    l.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(l.start_date).toLocaleDateString()} – {new Date(l.end_date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
