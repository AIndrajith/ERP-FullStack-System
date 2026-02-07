import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Target, Plus, Search, Filter, MessageSquare, Briefcase, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newLead, setNewLead] = useState({
        full_name: '',
        email: '',
        phone: '',
        source: '',
        status: 'NEW'
    });

    const fetchLeads = async () => {
        try {
            const res = await api.get('/crm/leads');
            setLeads(res.data);
        } catch (err) {
            toast.error('Failed to fetch leads');
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/crm/leads', newLead);
            toast.success('Lead captured successfully');
            setShowModal(false);
            setNewLead({ full_name: '', email: '', phone: '', source: '', status: 'NEW' });
            fetchLeads();
        } catch (err) {
            toast.error('Lead capture failed');
        }
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Target className="text-amber-500" size={32} />
                        Lead Acquisition
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Track potential business interests and initial inquiries.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-600/20"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    <span>Capture Lead</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        className="bg-slate-900 border-white/5 text-white pl-12 rounded-xl focus:ring-amber-500/50"
                        placeholder="Search leads by name or source..."
                    />
                </div>
                <button className="glass px-6 py-2.5 flex items-center gap-2 text-slate-300 font-bold text-sm">
                    <Filter size={16} /> Filter by Source
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 font-sans">
                {leads.map(l => (
                    <div key={l.id} className="glass p-6 group hover:translate-y-[-4px] transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 border-white/5 hover:border-amber-500/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 font-bold">
                                    {l.full_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white mb-0.5">{l.full_name}</div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                                        <Zap size={10} className="text-amber-500" /> {l.source || 'Direct Inquiry'}
                                    </div>
                                </div>
                            </div>
                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter bg-slate-800 text-slate-400 border border-white/5">
                                {l.status}
                            </span>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                <MessageSquare size={14} className="text-amber-500/50" />
                                <span className="truncate">{l.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                                <Briefcase size={14} className="text-amber-500/50" />
                                {l.phone}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2 pt-2">
                            <button className="flex-1 py-2 rounded-lg text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                                Notes
                            </button>
                            <button className="flex-1 py-2 rounded-lg text-xs font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/10 transition-colors">
                                Convert
                            </button>
                        </div>
                    </div>
                ))}
                {leads.length === 0 && (
                    <div className="col-span-full py-20 glass flex flex-col items-center justify-center text-slate-600 border-dashed border-2 border-white/5 opacity-50">
                        <Target size={48} className="mb-4" />
                        <p className="font-bold uppercase tracking-[0.3em] text-[10px]">Strategic leads queue empty</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="glass w-full max-w-lg p-10 relative animate-fadeIn shadow-2xl border-white/10 text-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/20 text-white">
                                <Target size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">New Lead Intake</h2>
                                <p className="text-slate-400 text-sm">Document a new potential business opportunity.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Candidate Name</label>
                                <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" placeholder="Prospect Name" value={newLead.full_name} onChange={e => setNewLead({ ...newLead, full_name: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Digital Reach</label>
                                    <input type="email" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" placeholder="email@address.com" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Direct Line</label>
                                    <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" placeholder="+1..." value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Referral Channel</label>
                                <select className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50 w-full" value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })}>
                                    <option value="">Select Origin</option>
                                    <option value="WEBSITE">Corporate Website</option>
                                    <option value="REFERRAL">Client Referral</option>
                                    <option value="SOCIAL">Social Networks</option>
                                    <option value="CONFERENCE">Trade Conference</option>
                                    <option value="DIRECT">Cold Outreach</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all uppercase tracking-widest" onClick={() => setShowModal(false)}>
                                    Cancel Intake
                                </button>
                                <button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-amber-600/30">
                                    Finalize Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
