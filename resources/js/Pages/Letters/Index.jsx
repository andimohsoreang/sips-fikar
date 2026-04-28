import React, { useState, useMemo } from 'react';
import SupabaseLayout from '@/Layouts/SupabaseLayout';
import SupabaseTable from '@/Components/SupabaseTable';
import SupabaseModal, { SupabaseDeleteModal } from '@/Components/SupabaseModal';
import SupabaseInput, { SupabaseSelect, SupabaseTextarea, SupabaseCombobox } from '@/Components/SupabaseInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Clipboard, Edit, Trash2, Calendar, Save, Sparkles, Building2, Printer } from 'lucide-react';

export default function Index({ auth, letters, documentTypes, classifications, subClassifications, recipients }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isChangingDept, setIsChangingDept] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleDepartmentChange = (form, deptSlug) => {
        setIsChangingDept(true);
        form.setData('department', deptSlug);
        setTimeout(() => setIsChangingDept(false), 500);
    };

    const createForm = useForm({
        department: 'sekretariat',
        letter_date: new Date().toISOString().split('T')[0],
        document_type_id: '',
        classification_id: '',
        sub_classification_id: '',
        recipient: '',
        subject: '',
        sequence_number: '',
    });

    const editForm = useForm({
        department: '',
        letter_date: '',
        document_type_id: '',
        classification_id: '',
        sub_classification_id: '',
        recipient: '',
        subject: '',
        sequence_number: '',
    });

    // Memoized filtered options based on selected department in forms
    const createFiltered = useMemo(() => ({
        types: documentTypes.filter(t => t.department === createForm.data.department),
        classifications: classifications.filter(c => c.department === createForm.data.department),
        subs: subClassifications.filter(s => s.department === createForm.data.department),
    }), [createForm.data.department, documentTypes, classifications, subClassifications]);

    const editFiltered = useMemo(() => ({
        types: documentTypes.filter(t => t.department === editForm.data.department),
        classifications: classifications.filter(c => c.department === editForm.data.department),
        subs: subClassifications.filter(s => s.department === editForm.data.department),
    }), [editForm.data.department, documentTypes, classifications, subClassifications]);

    const openEditModal = (item) => {
        setSelectedItem(item);
        editForm.setData({
            department: item.department,
            letter_date: item.letter_date,
            document_type_id: item.document_type_id,
            classification_id: item.classification_id,
            sub_classification_id: item.sub_classification_id,
            recipient: item.recipient,
            subject: item.subject,
            sequence_number: item.sequence_number,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('letters.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('letters.update', selectedItem.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const handleDelete = () => {
        editForm.delete(route('letters.destroy', selectedItem.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
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
                                // Optional visual feedback can be added here
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
                <div className="flex items-center justify-end space-x-1">
                    <a
                        href={route('letters.generate', row.id)}
                        title="Generate Surat"
                        className="p-2 text-slate-400 hover:text-supabase-brand rounded-lg hover:bg-supabase-brand/10 transition-all"
                    >
                        <Printer className="w-4 h-4" />
                    </a>
                    <button 
                        onClick={() => openEditModal(row)}
                        className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => openDeleteModal(row)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const departmentOptions = [
        { id: 'sekretariat', name: 'Sekretariat Dewan Komisaris' },
        { id: 'kapr', name: 'KAPR (Audit & Risiko)' }, { id: 'knr', name: 'KNR (Nominasi & Remunerasi)' }
    ];

    return (
        <SupabaseLayout user={auth.user} header="Registrasi Surat">
            <Head title="Registrasi Surat" />

            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Arsip Penomoran Surat</h2>
                        <p className="text-sm text-slate-500 mt-1">Kelola dan pantau seluruh penomoran surat secara real-time.</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <a 
                            href={route('letters.export-excel')}
                            className="flex items-center px-5 py-2.5 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="8" y1="13" x2="16" y2="13"></line>
                                <line x1="8" y1="17" x2="16" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            Export Excel (Offline Tracker)
                        </a>
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center px-6 py-2.5 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Registrasi Surat Baru
                        </button>
                    </div>
                </div>

                <SupabaseTable 
                    columns={columns} 
                    data={letters} 
                    searchPlaceholder="Cari nomor, tujuan, atau perihal..." 
                />
            </div>

            {/* Create Modal */}
            <SupabaseModal 
                show={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                title="Registrasi Surat Baru"
                maxWidth="2xl"
            >
                <form onSubmit={handleCreate} className="space-y-6 relative">
                    {isChangingDept && (
                        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-supabase-brand border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sinkronisasi Data Bidang...</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                        <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            <Building2 className="w-3 h-3 mr-2 text-supabase-brand" />
                            Pilih Bidang Utama
                        </div>
                        <SupabaseSelect
                            label="Bidang / Departemen"
                            value={createForm.data.department}
                            onChange={(e) => handleDepartmentChange(createForm, e.target.value)}
                            options={departmentOptions}
                            error={createForm.errors.department}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SupabaseInput
                            label="Tanggal Surat"
                            type="date"
                            value={createForm.data.letter_date}
                            onChange={(e) => createForm.setData('letter_date', e.target.value)}
                            error={createForm.errors.letter_date}
                            required
                        />
                        <SupabaseInput
                            label="Nomor Urut Manual"
                            type="number"
                            placeholder="Contoh: 125"
                            value={createForm.data.sequence_number}
                            onChange={(e) => createForm.setData('sequence_number', e.target.value)}
                            error={createForm.errors.sequence_number}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SupabaseSelect
                            label="Jenis Dokumen"
                            value={createForm.data.document_type_id}
                            onChange={(e) => createForm.setData('document_type_id', e.target.value)}
                            options={createFiltered.types}
                            error={createForm.errors.document_type_id}
                            required
                        />
                        <SupabaseSelect
                            label="Kualifikasi"
                            value={createForm.data.classification_id}
                            onChange={(e) => createForm.setData('classification_id', e.target.value)}
                            options={createFiltered.classifications}
                            error={createForm.errors.classification_id}
                            required
                        />
                        <SupabaseSelect
                            label="Sub Kualifikasi"
                            value={createForm.data.sub_classification_id}
                            onChange={(e) => createForm.setData('sub_classification_id', e.target.value)}
                            options={createFiltered.subs}
                            error={createForm.errors.sub_classification_id}
                            required
                        />
                    </div>

                    <SupabaseCombobox
                        label="Tujuan / Penerima"
                        placeholder="Cari dari master atau ketik manual..."
                        value={createForm.data.recipient}
                        onChange={(e) => createForm.setData('recipient', e.target.value)}
                        options={recipients}
                        error={createForm.errors.recipient}
                        required
                    />

                    <SupabaseTextarea
                        label="Perihal"
                        placeholder="Jelaskan isi singkat surat..."
                        value={createForm.data.subject}
                        onChange={(e) => createForm.setData('subject', e.target.value)}
                        error={createForm.errors.subject}
                        required
                    />

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="flex items-center px-8 py-3 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Registrasi
                        </button>
                    </div>
                </form>
            </SupabaseModal>

            {/* Edit Modal */}
            <SupabaseModal 
                show={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                title="Edit Data Surat"
                maxWidth="2xl"
            >
                <form onSubmit={handleUpdate} className="space-y-6 relative">
                    {isChangingDept && (
                        <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 border-4 border-supabase-brand border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Sinkronisasi Data Bidang...</p>
                            </div>
                        </div>
                    )}
                    <SupabaseSelect
                        label="Bidang / Departemen"
                        value={editForm.data.department}
                        onChange={(e) => handleDepartmentChange(editForm, e.target.value)}
                        options={departmentOptions}
                        error={editForm.errors.department}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SupabaseInput
                            label="Tanggal Surat"
                            type="date"
                            value={editForm.data.letter_date}
                            onChange={(e) => editForm.setData('letter_date', e.target.value)}
                            error={editForm.errors.letter_date}
                            required
                        />
                        <SupabaseInput
                            label="Nomor Urut Manual"
                            type="number"
                            value={editForm.data.sequence_number}
                            onChange={(e) => editForm.setData('sequence_number', e.target.value)}
                            error={editForm.errors.sequence_number}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SupabaseSelect
                            label="Jenis Dokumen"
                            value={editForm.data.document_type_id}
                            onChange={(e) => editForm.setData('document_type_id', e.target.value)}
                            options={editFiltered.types}
                            error={editForm.errors.document_type_id}
                            required
                        />
                        <SupabaseSelect
                            label="Kualifikasi"
                            value={editForm.data.classification_id}
                            onChange={(e) => editForm.setData('classification_id', e.target.value)}
                            options={editFiltered.classifications}
                            error={editForm.errors.classification_id}
                            required
                        />
                        <SupabaseSelect
                            label="Sub Kualifikasi"
                            value={editForm.data.sub_classification_id}
                            onChange={(e) => editForm.setData('sub_classification_id', e.target.value)}
                            options={editFiltered.subs}
                            error={editForm.errors.sub_classification_id}
                            required
                        />
                    </div>

                    <SupabaseCombobox
                        label="Tujuan / Penerima"
                        placeholder="Cari dari master atau ketik manual..."
                        value={editForm.data.recipient}
                        onChange={(e) => editForm.setData('recipient', e.target.value)}
                        options={recipients}
                        error={editForm.errors.recipient}
                        required
                    />

                    <SupabaseTextarea
                        label="Perihal"
                        value={editForm.data.subject}
                        onChange={(e) => editForm.setData('subject', e.target.value)}
                        error={editForm.errors.subject}
                        required
                    />

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="flex items-center px-8 py-3 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </SupabaseModal>

            {/* Delete Modal */}
            <SupabaseDeleteModal 
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                processing={editForm.processing}
                title="Hapus Registrasi Surat"
                message={`Apakah Anda yakin ingin menghapus nomor surat "${selectedItem?.full_number}"? Tindakan ini tidak dapat dibatalkan.`}
            />
        </SupabaseLayout>
    );
}
