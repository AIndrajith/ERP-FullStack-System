import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserPlus, Building, Mail, Briefcase, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEmp, setNewEmp] = useState({ full_name: '', email: '', department_id: '', title: '', status: 'ACTIVE' });

    const fetchData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                api.get('/hr/employees'),
                api.get('/hr/departments')
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
        } catch (err) {
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hr/employees', newEmp);
            toast.success('Employee record created');
            setShowModal(false);
            setNewEmp({ full_name: '', email: '', department_id: '', title: '', status: 'ACTIVE' });
            fetchData();
        } catch (err) {
            toast.error('Failed to create employee');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Talent Directory</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Centralized management of human capital and organizational structure.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <UserPlus size={18} />
                    <span>Onboard Employee</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        className="bg-slate-900 border-white/5 text-white pl-12 rounded-xl focus:ring-indigo-500/50"
                        placeholder="Search by name, role or department..."
                    />
                </div>
                <button className="glass px-6 py-2.5 flex items-center gap-2 text-slate-300 font-bold text-sm">
                    <Filter size={16} /> Filter
                </button>
            </div>

            <div className="glass overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Organizational Unit</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {employees.map(e => (
                                <tr key={e.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shadow-inner">
                                                {e.full_name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white leading-tight">{e.full_name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Mail size={10} /> {e.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-slate-200 font-medium">{e.title}</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                <Briefcase size={8} /> Professional
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-800/80 text-slate-300 border border-white/5">
                                            <Building size={12} className="text-indigo-400" />
                                            {e.department?.name || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${e.status === 'ACTIVE'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                            {e.status}
                                        </span>
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
                    <div className="glass w-full max-w-xl p-10 relative animate-fadeIn shadow-2xl border-white/10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <UserPlus size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Employee Onboarding</h2>
                                <p className="text-slate-400 text-sm">Register a new profile in the HR database.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
                                    <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" placeholder="Jane Cooper" value={newEmp.full_name} onChange={v => setNewEmp({ ...newEmp, full_name: v.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Work Email</label>
                                    <input type="email" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" placeholder="jane@nexus.com" value={newEmp.email} onChange={v => setNewEmp({ ...newEmp, email: v.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Department</label>
                                    <select className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" value={newEmp.department_id} onChange={v => setNewEmp({ ...newEmp, department_id: v.target.value })}>
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Job Title</label>
                                    <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" placeholder="Senior Architect" value={newEmp.title} onChange={v => setNewEmp({ ...newEmp, title: v.target.value })} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary text-sm font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                                    Complete Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
