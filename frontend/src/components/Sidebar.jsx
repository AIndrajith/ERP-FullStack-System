import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserCog, Briefcase,
    Package, ShoppingBag, ClipboardList, LogOut, ShieldCheck,
    BarChart3, Users2, Target, TrendingUp
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
    const { logout, hasPermission } = useAuth();

    const sections = [
        {
            title: 'General',
            items: [
                { title: 'Dashboard', icon: (active) => <LayoutDashboard size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />, path: '/dashboard', perm: 'dashboard.read' },
            ]
        },
        {
            title: 'Human Resources',
            items: [
                { title: 'Employees', icon: (active) => <Briefcase size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />, path: '/hr/employees', perm: 'hr.employees.read' },
                { title: 'Leave Board', icon: (active) => <ClipboardList size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />, path: '/hr/leave', perm: 'hr.leave.read' },
            ]
        },
        {
            title: 'Customer Relations',
            items: [
                { title: 'Customers', icon: (active) => <Users2 size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-amber-400'} />, path: '/crm/customers', perm: 'crm.customers.read' },
                { title: 'Sales Leads', icon: (active) => <Target size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-amber-400'} />, path: '/crm/leads', perm: 'crm.leads.read' },
                { title: 'Opportunities', icon: (active) => <TrendingUp size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} />, path: '/crm/opportunities', perm: 'crm.opportunities.read' },
            ]
        },
        {
            title: 'Inventory',
            items: [
                { title: 'Products', icon: (active) => <Package size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-amber-400'} />, path: '/inventory', perm: 'inv.products.read' },
            ]
        },
        {
            title: 'System',
            items: [
                { title: 'User Access', icon: (active) => <UserCog size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />, path: '/users', perm: 'users.read' },
                { title: 'Audit Logs', icon: (active) => <ShieldCheck size={18} className={active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />, path: '/audit-log', perm: 'audit.read' },
            ]
        }
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col h-full overflow-hidden">
            <div className="p-8 flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <LayoutDashboard size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">ERP Nexus</span>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-8 pb-8">
                {sections.map((section) => {
                    const visibleItems = section.items.filter(item => hasPermission(item.perm));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={section.title} className="space-y-1">
                            <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                                {section.title}
                            </h3>
                            {visibleItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                            ? item.path.startsWith('/crm') ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' :
                                                item.path.startsWith('/inventory') ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' :
                                                    'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className="transition-colors">
                                                {typeof item.icon === 'function' ? item.icon(isActive) : item.icon}
                                            </span>
                                            <span className="font-medium text-sm">{item.title}</span>
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
                >
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
