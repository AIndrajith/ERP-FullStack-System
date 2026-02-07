import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { Calendar, FileText, Check, X, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const LeaveRequests = () => {
    const [requests, setRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { user, hasPermission } = useAuth();
    const [newRequest, setNewRequest] = useState({ start_date: '', end_date: '', reason: '', employee_id: null });

    const fetchRequests = async () => {
        try {
            const res = await api.get('/hr/leave-requests');
            setRequests(res.data);
        } catch (err) {
            toast.error('Failed to fetch leave requests');
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await api.post(`/hr/leave-requests/${id}/${action}`);
            toast.success(`Request ${action}ed successfully`);
            fetchRequests();
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const empRes = await api.get('/hr/employees');
            const employee = empRes.data.find(e => e.user_id === user.id);
            if (!employee) throw new Error('No employee record linked to your user account');

            await api.post('/hr/leave-requests', { ...newRequest, employee_id: employee.id });
            toast.success('Leave request submitted to management');
            setShowModal(false);
            setNewRequest({ start_date: '', end_date: '', reason: '', employee_id: null });
            fetchRequests();
        } catch (err) {
            toast.error(err.message || 'Submission failed');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Leave Administration</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Review, approve and manage employee absence schedules.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    <span>New Absence Request</span>
                </button>
            </div>

            <div className="glass overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee Entity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timeframe</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Validation</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Governing Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.map(r => (
                                <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-white">{r.employee.full_name}</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">UID: {r.employee.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                                            <Calendar size={12} className="text-indigo-400" />
                                            {r.start_date} <ArrowRight size={10} /> {r.end_date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs truncate text-xs text-slate-400 flex items-start gap-2">
                                            <FileText size={12} className="mt-0.5 shrink-0" />
                                            {r.reason}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                r.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {r.status === 'PENDING' && <Clock size={10} />}
                                            {r.status === 'APPROVED' && <Check size={10} />}
                                            {r.status === 'REJECTED' && <X size={10} />}
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {r.status === 'PENDING' && hasPermission('hr.leave.approve') && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                                    onClick={() => handleAction(r.id, 'approve')}
                                                    title="Approve"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
                                                    onClick={() => handleAction(r.id, 'reject')}
                                                    title="Reject"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <div className="glass w-full max-w-lg p-10 relative animate-fadeIn shadow-2xl border-white/10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Absence Submission</h2>
                                <p className="text-slate-400 text-sm">Request a temporary absence from your professional duties.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Effective Date</label>
                                    <input type="date" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" value={newRequest.start_date} onChange={e => setNewRequest({ ...newRequest, start_date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Conclusion Date</label>
                                    <input type="date" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" value={newRequest.end_date} onChange={e => setNewRequest({ ...newRequest, end_date: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Justification</label>
                                <textarea rows="3" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50 resize-none" placeholder="Provide professional context for your absence request..." value={newRequest.reason} onChange={e => setNewRequest({ ...newRequest, reason: e.target.value })} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all uppercase tracking-widest" onClick={() => setShowModal(false)}>
                                    Discard
                                </button>
                                <button type="submit" className="flex-1 btn-primary text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                                    Execute Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaveRequests;
