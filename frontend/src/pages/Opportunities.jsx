import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DollarSign, Plus, Search, Filter, Calendar, TrendingUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Opportunities = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newOpp, setNewOpp] = useState({
        title: '',
        value: 0,
        stage: 'PROSPECTING',
        close_date: '',
        customer_id: null
    });

    const fetchOpportunities = async () => {
        try {
            const res = await api.get('/crm/opportunities');
            setOpportunities(res.data);
        } catch (err) {
            toast.error('Failed to fetch opportunities');
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/crm/opportunities', newOpp);
            toast.success('Opportunity Pipeline updated');
            setShowModal(false);
            setNewOpp({ title: '', value: 0, stage: 'PROSPECTING', close_date: '', customer_id: null });
            fetchOpportunities();
        } catch (err) {
            toast.error('Pipeline entry failed');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" size={32} />
                        Sales Pipeline
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Monitor high-value deal progression and revenue forecasting.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    <span>Open Opportunity</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 border-l-4 border-emerald-500">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Projected Revenue</div>
                    <div className="text-3xl font-extrabold text-white">$142,500.00</div>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-tighter">
                        <ShieldCheck size={10} /> Validated Pipeline
                    </div>
                </div>
                <div className="glass p-6 border-l-4 border-amber-500">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Active Negotiations</div>
                    <div className="text-3xl font-extrabold text-white">{opportunities.length} Contracts</div>
                </div>
                <div className="glass p-6 border-l-4 border-indigo-500">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Conversion Velocity</div>
                    <div className="text-3xl font-extrabold text-white">24.5%</div>
                </div>
            </div>

            <div className="glass overflow-hidden shadow-2xl bg-slate-900/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 font-sans">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Opportunity Descriptor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Fiscal Value</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Lifecycle Stage</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Forecast Closure</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {opportunities.map(o => (
                                <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{o.title}</div>
                                        <div className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">CONTRACT-ID: {o.id.toString().padStart(6, '0')}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono">
                                        <div className="text-lg font-bold text-slate-200">${o.value.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${o.stage === 'CLOSED_WON' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                o.stage === 'CLOSED_LOST' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                            {o.stage.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                            <Calendar size={12} className="text-emerald-500 opacity-50" />
                                            {o.close_date ? new Date(o.close_date).toLocaleDateString() : 'Unscheduled'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {opportunities.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-slate-600">
                                        <DollarSign size={40} className="mx-auto mb-4 opacity-10" />
                                        <p className="uppercase tracking-[0.2em] text-[10px] font-bold">Strategic pipeline initialized - No active negotiations</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="glass w-full max-w-lg p-10 relative animate-fadeIn shadow-2xl border-white/10 text-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 text-white">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Opportunity Definition</h2>
                                <p className="text-slate-400 text-sm">Capture details for a high-value strategic deal.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Engagement Title</label>
                                <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-emerald-500/50" placeholder="e.g. Enterprise Cloud Integration" value={newOpp.title} onChange={e => setNewOpp({ ...newOpp, title: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fiscal Allocation ($)</label>
                                    <input type="number" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-emerald-500/50" value={newOpp.value} onChange={e => setNewOpp({ ...newOpp, value: parseFloat(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Closure Target</label>
                                    <input type="date" className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-emerald-500/50" value={newOpp.close_date} onChange={e => setNewOpp({ ...newOpp, close_date: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Pipeline Maturity</label>
                                <select className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-emerald-500/50 w-full" value={newOpp.stage} onChange={e => setNewOpp({ ...newOpp, stage: e.target.value })}>
                                    <option value="PROSPECTING">Prospecting</option>
                                    <option value="QUALIFICATION">Qualification</option>
                                    <option value="PROPOSAL">Proposal Analysis</option>
                                    <option value="NEGOTIATION">Contract Negotiation</option>
                                    <option value="CLOSED_WON">Closed (Won)</option>
                                    <option value="CLOSED_LOST">Closed (Lost)</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all uppercase tracking-widest" onClick={() => setShowModal(false)}>
                                    Discard Entry
                                </button>
                                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/30 transition-all font-sans">
                                    Commit Pipeline
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Opportunities;
