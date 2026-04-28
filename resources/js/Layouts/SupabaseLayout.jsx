import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { 
    LayoutDashboard, 
    Mail, 
    Send, 
    Settings, 
    FolderTree, 
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    FileText,
    Tag
} from 'lucide-react';

export default function SupabaseLayout({ user, header, children }) {
    const { flash } = usePage().props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navSections = [
        {
            title: null,
            items: [
                { name: 'Dashboard', icon: LayoutDashboard, href: route('dashboard') },
            ]
        },
        {
            title: 'Sistem Penomoran Surat',
            items: [
                { name: 'Registrasi Surat', icon: Mail, href: route('letters.index') },
                { name: 'Generate Surat', icon: Send, href: route('letters.generator.index') },
                { name: 'Jenis Dokumen', icon: FileText, href: route('document-types.index') },
                { name: 'Kualifikasi', icon: Tag, href: route('classifications.index') },
                { name: 'Sub Kualifikasi', icon: FolderTree, href: route('sub-classifications.index') },
                { name: 'Master Tujuan', icon: User, href: route('recipients.index') },
                { name: 'Master Bidang', icon: Settings, href: route('departments.index') },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-supabase-brand/30">
            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 z-40 h-screen transition-transform border-r border-supabase-border bg-supabase-canvas ${
                    isSidebarOpen ? 'translate-x-0 w-[240px]' : '-translate-x-full w-0 lg:translate-x-0 lg:w-16'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-4 border-b border-supabase-border">
                        <div className="bg-supabase-brand w-8 h-8 rounded-md flex items-center justify-center mr-3 shrink-0 shadow-[0_0_15px_rgba(62,207,142,0.3)]">
                            <Mail className="text-white w-5 h-5" />
                        </div>
                        {isSidebarOpen && <span className="font-bold text-lg tracking-tight text-white">SIPS</span>}
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-2 py-4 overflow-y-auto custom-scrollbar">
                        {navSections.map((section, sIdx) => (
                            <div key={sIdx} className={sIdx > 0 ? 'mt-6' : ''}>
                                {section.title && isSidebarOpen && (
                                    <h3 className="px-3 mb-2 mt-2 text-[11px] font-semibold text-supabase-subtext uppercase tracking-wider">
                                        {section.title}
                                    </h3>
                                )}
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center px-3 py-1.5 text-[13px] rounded-md transition-colors group ${
                                                route().current(item.href.split('/').pop() + '*') 
                                                ? 'bg-supabase-brand/10 text-supabase-brand font-medium' 
                                                : 'text-supabase-subtext hover:bg-supabase-panel hover:text-supabase-text'
                                            }`}
                                        >
                                            <item.icon className={`w-4 h-4 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                                            {isSidebarOpen && <span>{item.name}</span>}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-supabase-border">
                        <Link 
                            method="post" 
                            href={route('logout')} 
                            as="button"
                            className="flex items-center w-full px-3 py-1.5 text-[13px] font-medium text-supabase-subtext rounded-md hover:bg-supabase-panel hover:text-red-400 transition-colors"
                        >
                            <LogOut className={`w-4 h-4 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                            {isSidebarOpen && <span>Logout</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[240px]' : 'lg:ml-16'}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 mr-4 text-slate-400 hover:text-slate-600 lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center text-sm text-slate-500">
                            <span>SIPS</span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="text-slate-900 font-medium">{header}</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                            <User className="w-3.5 h-3.5 mr-2 text-supabase-brand" />
                            {user.name}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>

            {/* Toast Notifications */}
            {showToast && (
                <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={`flex items-center p-4 rounded-2xl shadow-2xl border ${
                        flash?.success 
                        ? 'bg-white border-emerald-100 text-emerald-800' 
                        : 'bg-white border-red-100 text-red-800'
                    }`}>
                        {flash?.success ? (
                            <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />
                        ) : (
                            <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                        )}
                        <span className="text-sm font-bold pr-8">{flash?.success || flash?.error}</span>
                        <button 
                            onClick={() => setShowToast(false)}
                            className="p-1 hover:bg-slate-50 rounded-lg transition-all absolute top-2 right-2"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
