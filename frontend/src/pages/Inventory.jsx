import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Plus, AlertTriangle, Search, Filter, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ sku: '', name: '', description: '', current_stock: 0, low_stock_threshold: 10, unit: 'pcs' });

    const fetchProducts = async () => {
        try {
            const res = await api.get('/inventory/products');
            setProducts(res.data);
        } catch (err) {
            toast.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/inventory/products', newProduct);
            toast.success('Product created');
            setShowModal(false);
            setNewProduct({ sku: '', name: '', description: '', current_stock: 0, low_stock_threshold: 10, unit: 'pcs' });
            fetchProducts();
        } catch (err) {
            toast.error('Failed to create product');
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Global Inventory</h1>
                    <p className="text-slate-400 mt-1 font-medium text-sm">Monitor stock levels, manage product master data and warehouse operations.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} />
                    <span>Register Product</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        className="bg-slate-900 border-white/5 text-white pl-12 rounded-xl focus:ring-amber-500/50"
                        placeholder="Search SKU or product name..."
                    />
                </div>
                <button className="glass px-6 py-2.5 flex items-center gap-2 text-slate-300 font-bold text-sm">
                    <Filter size={16} /> Filter Stock
                </button>
            </div>

            <div className="glass overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product Identifier</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Metrics</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-500 border border-white/5 group-hover:border-amber-500/30 transition-all shadow-inner">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{p.name}</div>
                                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md mt-1 inline-block">
                                                    SKU: {p.sku}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono">
                                        <div className="text-xl font-bold text-slate-200">{p.current_stock}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{p.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {p.current_stock <= p.low_stock_threshold ? (
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                                <AlertTriangle size={12} /> Critical Stock
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                                                Optimized
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
                            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <Plus size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">New Product Entry</h2>
                                <p className="text-slate-400 text-sm">Add a new item to the central sku registry.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6 text-sm">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Universal SKU</label>
                                    <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" placeholder="SKU-001" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
                                    <input required className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" placeholder="MacBook Pro M3" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Initial Reserve</label>
                                    <input type="number" className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" value={newProduct.current_stock} onChange={e => setNewProduct({ ...newProduct, current_stock: parseInt(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Measurement Unit</label>
                                    <input className="bg-slate-900 border-white/5 text-white p-3 rounded-xl focus:ring-amber-500/50" placeholder="pcs / kg / m" value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 px-6 py-3.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all uppercase tracking-widest" onClick={() => setShowModal(false)}>
                                    Discard
                                </button>
                                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/30">
                                    Commit Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
