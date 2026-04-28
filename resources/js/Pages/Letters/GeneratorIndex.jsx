import React, { useState } from 'react';
import SupabaseLayout from '@/Layouts/SupabaseLayout';
import SupabaseTable from '@/Components/SupabaseTable';
import SupabaseModal from '@/Components/SupabaseModal';
import { Head } from '@inertiajs/react';
import { Send, Calendar, Printer, Eye, Building2, User, FileText, Tag } from 'lucide-react';

export default function GeneratorIndex({ auth, letters }) {
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState(null);

    const openDetailModal = (letter) => {
        setSelectedLetter(letter);
        setIsDetailModalOpen(true);
    };

    const columns = [
        {
            header: 'Bidang',
            cell: (row) => (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    row.department === 'sekretariat' 
                    ? 'bg-slate-100 text-slate-600' 
                    : row.department === 'kapr' ? 'bg-supabase-brand/10 text-supabase-brand' : 'bg-indigo-50 text-indigo-600'
                }`}>
                    {row.department === 'sekretariat' ? 'Sekretariat' : row.department === 'kapr' ? 'KAPR' : 'KNR'}
                </span>
            )
        },
        {
            header: 'Nomor Surat',
            cell: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center space-x-2 group">
                        <span className="font-bold text-slate-900 font-mono tracking-tight">{row.full_number}</span>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(row.full_number);
                            }}
                            title="Copy Nomor Surat"
                            className="p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-supabase-brand hover:bg-supabase-brand/10 rounded transition-all"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center mt-0.5">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(row.letter_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>
            )
        },
        {
            header: 'Tujuan & Perihal',
            cell: (row) => (
                <div className="flex flex-col max-w-xs">
                    <span className="font-semibold text-slate-700 truncate">{row.recipient}</span>
                    <span className="text-xs text-slate-500 line-clamp-1 italic">"{row.subject}"</span>
                </div>
            )
        },
        {
            header: 'Aksi',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end space-x-2">
                    <button
                        onClick={() => openDetailModal(row)}
                        className="flex items-center px-4 py-2 text-xs font-bold text-supabase-brand bg-supabase-brand/10 hover:bg-supabase-brand hover:text-white rounded-xl transition-all shadow-sm group"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail Surat
                    </button>
                </div>
            )
        }
    ];

    return (
        <SupabaseLayout user={auth.user} header="Generate Surat">
            <Head title="Generate Surat" />

            <div className="flex flex-col space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="bg-supabase-brand/10 p-3 rounded-2xl">
                        <Send className="w-6 h-6 text-supabase-brand" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Generate Cetak Surat</h2>
                        <p className="text-sm text-slate-500 mt-1">Pilih surat dari tabel berikut untuk masuk ke editor cetak/PDF.</p>
                    </div>
                </div>

                <SupabaseTable 
                    columns={columns} 
                    data={letters} 
                    searchPlaceholder="Cari nomor, tujuan, atau perihal untuk di-generate..." 
                />
            </div>

            {/* Detail Modal */}
            <SupabaseModal
                show={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Registrasi Surat"
                maxWidth="lg"
            >
                {selectedLetter && (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center space-x-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                <FileText className="w-6 h-6 text-supabase-brand" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nomor Surat</h4>
                                <p className="text-lg font-mono font-bold text-slate-900">{selectedLetter.full_number}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center"><Building2 className="w-3 h-3 mr-1"/> Bidang</h4>
                                <p className="text-sm font-semibold text-slate-700 capitalize">{selectedLetter.department === 'sekretariat' ? 'Sekretariat' : selectedLetter.department}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1"/> Tanggal Surat</h4>
                                <p className="text-sm font-semibold text-slate-700">
                                    {new Date(selectedLetter.letter_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center"><User className="w-3 h-3 mr-1"/> Tujuan / Kepada</h4>
                                <p className="text-sm font-semibold text-slate-700">{selectedLetter.recipient}</p>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center"><Tag className="w-3 h-3 mr-1"/> Perihal</h4>
                                <p className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedLetter.subject}</p>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                            >
                                Kembali
                            </button>
                            <a
                                href={route('letters.generate', selectedLetter.id)}
                                className="flex items-center px-6 py-2.5 text-sm font-bold text-white bg-supabase-brand hover:bg-supabase-brand-hover rounded-xl transition-all shadow-sm shadow-supabase-brand/20 group"
                            >
                                <Printer className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                Lanjutkan Cetak PDF
                            </a>
                        </div>
                    </div>
                )}
            </SupabaseModal>
        </SupabaseLayout>
    );
}
