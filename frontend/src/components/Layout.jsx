import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-10">
                <div className="max-w-7xl mx-auto animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
