import React, { useState } from 'react';
import SupabaseLayout from '@/Layouts/SupabaseLayout';
import SupabaseTable from '@/Components/SupabaseTable';
import SupabaseModal, { SupabaseDeleteModal } from '@/Components/SupabaseModal';
import SupabaseInput, { SupabaseSelect } from '@/Components/SupabaseInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, Save, Tag } from 'lucide-react';

export default function Index({ auth, classifications }) {
    const { departments } = usePage().props;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const createForm = useForm({
        department: departments[0]?.slug || 'sekretariat',
        name: '',
        code: '',
    });

    const editForm = useForm({
        department: '',
        name: '',
        code: '',
    });

    const openEditModal = (item) => {
        setSelectedItem(item);
        editForm.setData({ 
            department: item.department,
            name: item.name, 
            code: item.code 
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('classifications.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('classifications.update', selectedItem.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const handleDelete = () => {
        editForm.delete(route('classifications.destroy', selectedItem.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const columns = [
        {
            header: 'Bidang',
            cell: (row) => {
                const dept = departments.find(d => d.slug === row.department);
                const colorMap = {
                    slate: 'bg-slate-100 text-slate-600',
                    supabase: 'bg-supabase-brand/10 text-supabase-brand',
                    indigo: 'bg-indigo-50 text-indigo-600',
                };
                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorMap[dept?.color] || 'bg-slate-100 text-slate-600'}`}>
                        {dept?.slug === 'sekretariat' ? 'Sekretariat' : dept?.name || row.department}
                    </span>
                );
            }
        },
        {
            header: 'Kode',
            cell: (row) => <span className="font-mono font-bold text-slate-900">{row.code}</span>
        },
        {
            header: 'Nama Kualifikasi',
            cell: (row) => <span className="font-semibold text-slate-700">{row.name}</span>
        },
        {
            header: 'Aksi',
            className: 'text-right',
            cell: (row) => (
                <div className="flex items-center justify-end space-x-1">
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

    const departmentOptions = departments.map(d => ({ id: d.slug, name: d.name }));

    return (
        <SupabaseLayout user={auth.user} header="Kualifikasi">
            <Head title="Kualifikasi" />

            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Master Kualifikasi</h2>
                        <p className="text-sm text-slate-500 mt-1">Definisikan kategori kualifikasi untuk penomoran surat.</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center px-6 py-2.5 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm hover:shadow-lg"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Kualifikasi
                    </button>
                </div>

                <SupabaseTable 
                    columns={columns} 
                    data={classifications} 
                    searchPlaceholder="Cari nama atau kode..." 
                />
            </div>

            {/* Create Modal */}
            <SupabaseModal 
                show={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                title="Tambah Kualifikasi Baru"
            >
                <form onSubmit={handleCreate} className="space-y-6">
                    <SupabaseSelect
                        label="Bidang / Departemen"
                        value={createForm.data.department}
                        onChange={(e) => createForm.setData('department', e.target.value)}
                        options={departmentOptions}
                        error={createForm.errors.department}
                        required
                    />
                    <SupabaseInput
                        label="Kode Kualifikasi"
                        placeholder="Contoh: 00, 01, 02"
                        value={createForm.data.code}
                        onChange={(e) => createForm.setData('code', e.target.value)}
                        error={createForm.errors.code}
                        required
                    />
                    <SupabaseInput
                        label="Nama Kualifikasi"
                        placeholder="Contoh: Umum"
                        value={createForm.data.name}
                        onChange={(e) => createForm.setData('name', e.target.value)}
                        error={createForm.errors.name}
                        required
                    />
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={createForm.processing}
                            className="flex items-center px-8 py-3 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Data
                        </button>
                    </div>
                </form>
            </SupabaseModal>

            {/* Edit Modal */}
            <SupabaseModal 
                show={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                title="Edit Kualifikasi"
            >
                <form onSubmit={handleUpdate} className="space-y-6">
                    <SupabaseSelect
                        label="Bidang / Departemen"
                        value={editForm.data.department}
                        onChange={(e) => editForm.setData('department', e.target.value)}
                        options={departmentOptions}
                        error={editForm.errors.department}
                        required
                    />
                    <SupabaseInput
                        label="Kode Kualifikasi"
                        value={editForm.data.code}
                        onChange={(e) => editForm.setData('code', e.target.value)}
                        error={editForm.errors.code}
                        required
                    />
                    <SupabaseInput
                        label="Nama Kualifikasi"
                        value={editForm.data.name}
                        onChange={(e) => editForm.setData('name', e.target.value)}
                        error={editForm.errors.name}
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
                title="Hapus Kualifikasi"
                message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"?`}
            />
        </SupabaseLayout>
    );
}
