import SupabaseLayout from '@/Layouts/SupabaseLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Mail, FileText, Tag, TrendingUp } from 'lucide-react';

export default function Dashboard({ totalLetters, totalTypes, totalClassifications, totalToday, recentLetters = [] }) {
    const { auth } = usePage().props;
    
    const stats = [
        { name: 'Total Surat Terdaftar', value: totalLetters, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
        { name: 'Jenis Dokumen', value: totalTypes, icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { name: 'Kualifikasi', value: totalClassifications, icon: Tag, color: 'text-purple-500', bg: 'bg-purple-50' },
        { name: 'Bulan Ini', value: totalToday, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <SupabaseLayout
            user={auth.user}
            header="Dashboard Overview"
        >
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col space-y-3 shadow-sm hover:border-slate-300 transition-all">
                        <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.name}</span>
                        </div>
                        <div className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Registrasi Surat Terbaru</h3>
                    <Link href={route('letters.index')} className="text-[12px] font-semibold text-supabase-brand hover:underline">
                        Lihat Semua &rarr;
                    </Link>
                </div>
                
                {recentLetters.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {recentLetters.map((letter) => (
                            <div key={letter.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                            letter.department === 'sekretariat' 
                                            ? 'bg-slate-100 text-slate-600' 
                                            : letter.department === 'kapr' ? 'bg-supabase-brand/10 text-supabase-brand' : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                            {letter.department}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-slate-900">{letter.full_number}</span>
                                    </div>
                                    <span className="text-sm text-slate-700 font-medium">{letter.recipient}</span>
                                    <span className="text-xs text-slate-500 line-clamp-1 italic">"{letter.subject}"</span>
                                </div>
                                <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                    {new Date(letter.letter_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500 text-sm">
                        Belum ada surat yang diregistrasikan.
                    </div>
                )}
            </div>
        </SupabaseLayout>
    );
}
