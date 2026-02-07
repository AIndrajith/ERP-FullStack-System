import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShieldAlert, Terminal, Clock, Fingerprint } from 'lucide-react';
import toast from 'react-hot-toast';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/users/audit-logs');
                setLogs(res.data);
            } catch (err) {
                toast.error('Failed to fetch audit logs');
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="space-y-8 animate-fadeIn">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <ShieldAlert className="text-indigo-400" size={32} />
                    System Audit Trail
                </h1>
                <p className="text-slate-400 mt-1 font-medium text-sm">Immutable ledger of critical system operations and administrative actions.</p>
            </div>

            <div className="glass overflow-hidden shadow-2xl border-white/5 bg-slate-900/40">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Operation</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Resource mapping</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Payload metadata</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Chronology</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-tight">
                                            <Terminal size={10} />
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-slate-300 font-bold">{log.entity_type}</span>
                                            <span className="text-slate-500 flex items-center gap-1">
                                                <Fingerprint size={10} /> GUID: {log.entity_id}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-md bg-black/40 p-2 rounded border border-white/5 text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap group-hover:whitespace-normal group-hover:bg-black/60 transition-all duration-300">
                                            {JSON.stringify(log.metadata_json)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-500">
                                            <Clock size={10} />
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                            <ShieldAlert size={48} className="opacity-20 mb-4" />
                            <p className="font-bold uppercase tracking-[0.2em] text-sm">No Audit Records synchronized</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLog;
