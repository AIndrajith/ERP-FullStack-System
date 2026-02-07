import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, UserPlus, Search, Filter, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/crm/customers');
            setCustomers(res.data);
        } catch (err) {
            toast.error('Failed to fetch customers');
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/crm/customers', newCustomer);
            toast.success('Customer registered successfully');
            setShowModal(false);
            setNewCustomer({ full_name: '', email: '', phone: '', address: '' });
            fetchCustomers();
        } catch (err) {
            toast.error('Registration failed');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Customer Relations</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Manage your client base and communication history.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                    onClick={() => setShowModal(true)}
                >
                    <UserPlus size={18} />
                    <span>Register Client</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        className="bg-slate-900 border-white/5 text-white pl-12 rounded-xl focus:ring-indigo-500/50"
                        placeholder="Search by name, email or phone..."
                    />
                </div>
                <button className="glass px-6 py-2.5 flex items-center gap-2 text-slate-300 font-bold text-sm">
                    <Filter size={16} /> Advanced Filter
                </button>
            </div>

            <div className="glass overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Identity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {customers.map(c => (
                                <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 font-bold">
                                                {c.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{c.full_name}</div>
                                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">CID-{c.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <Mail size={12} className="text-indigo-400" />
                                                {c.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Phone size={12} />
                                                {c.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <MapPin size={12} />
                                            {c.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            Active Client
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-slate-500">
                                        <Users size={40} className="mx-auto mb-4 opacity-10" />
                                        <p className="uppercase tracking-widest text-xs font-bold">No clients found in registry</p>
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
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Client Registration</h2>
                                <p className="text-slate-400 text-sm">Add a new entity to your customer database.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" placeholder="Johnathan Doe" value={newCustomer.full_name} onChange={e => setNewCustomer({ ...newCustomer, full_name: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" placeholder="john@example.com" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
                                    <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50" placeholder="+1 (555) 000-0000" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Physical Address</label>
                                <textarea rows="2" className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-indigo-500/50 resize-none" placeholder="123 Business Way, Suite 500..." value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all uppercase tracking-widest" onClick={() => setShowModal(false)}>
                                    Discard
                                </button>
                                <button type="submit" className="flex-1 btn-primary font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
