import React, { useState } from 'react';
import SupabaseLayout from '@/Layouts/SupabaseLayout';
import SupabaseTable from '@/Components/SupabaseTable';
import SupabaseModal, { SupabaseDeleteModal } from '@/Components/SupabaseModal';
import SupabaseInput, { SupabaseSelect } from '@/Components/SupabaseInput';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Save, Building2 } from 'lucide-react';

export default function Index({ auth, departments_data }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const createForm = useForm({
        name: '',
        color: 'slate',
    });

    const editForm = useForm({
        name: '',
        color: '',
    });

    const openEditModal = (item) => {
        setSelectedItem(item);
        editForm.setData({ 
            name: item.name, 
            color: item.color 
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('departments.store'), {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('departments.update', selectedItem.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const handleDelete = () => {
        editForm.delete(route('departments.destroy', selectedItem.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const colorOptions = [
        { id: 'slate', name: 'Slate (Sekretariat Style)' },
        { id: 'supabase', name: 'Supabase Green (KAPR Style)' },
        { id: 'indigo', name: 'Indigo (KNR Style)' },
        { id: 'emerald', name: 'Emerald Green' },
        { id: 'rose', name: 'Rose Red' },
        { id: 'amber', name: 'Amber Orange' },
    ];

    const columns = [
        {
            header: 'Nama Bidang',
            cell: (row) => (
                <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        row.color === 'supabase' ? 'bg-supabase-brand text-white' :
                        row.color === 'indigo' ? 'bg-indigo-600 text-white' :
                        'bg-slate-800 text-white'
                    }`}>
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{row.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{row.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Tema Warna',
            cell: (row) => {
                const colorMap = {
                    slate: 'bg-slate-100 text-slate-600',
                    supabase: 'bg-supabase-brand/10 text-supabase-brand',
                    indigo: 'bg-indigo-50 text-indigo-600',
                    emerald: 'bg-emerald-50 text-emerald-600',
                    rose: 'bg-rose-50 text-rose-600',
                    amber: 'bg-amber-50 text-amber-600',
                };
                return (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorMap[row.color]}`}>
                        {row.color}
                    </span>
                );
            }
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

    return (
        <SupabaseLayout user={auth.user} header="Master Bidang">
            <Head title="Master Bidang" />

            <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Master Bidang & Departemen</h2>
                        <p className="text-sm text-slate-500 mt-1">Kelola daftar bidang secara dinamis untuk seluruh sistem.</p>
                    </div>
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center px-6 py-2.5 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm hover:shadow-lg"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Bidang
                    </button>
                </div>

                <SupabaseTable 
                    columns={columns} 
                    data={departments_data} 
                    searchPlaceholder="Cari nama bidang..." 
                />
            </div>

            {/* Create Modal */}
            <SupabaseModal 
                show={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                title="Tambah Bidang Baru"
            >
                <form onSubmit={handleCreate} className="space-y-6">
                    <SupabaseInput
                        label="Nama Bidang"
                        placeholder="Contoh: Komite Audit & Risiko"
                        value={createForm.data.name}
                        onChange={(e) => createForm.setData('name', e.target.value)}
                        error={createForm.errors.name}
                        required
                    />
                    <SupabaseSelect
                        label="Tema Warna"
                        value={createForm.data.color}
                        onChange={(e) => createForm.setData('color', e.target.value)}
                        options={colorOptions}
                        error={createForm.errors.color}
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
                title="Edit Data Bidang"
            >
                <form onSubmit={handleUpdate} className="space-y-6">
                    <SupabaseInput
                        label="Nama Bidang"
                        value={editForm.data.name}
                        onChange={(e) => editForm.setData('name', e.target.value)}
                        error={editForm.errors.name}
                        required
                    />
                    <SupabaseSelect
                        label="Tema Warna"
                        value={editForm.data.color}
                        onChange={(e) => editForm.setData('color', e.target.value)}
                        options={colorOptions}
                        error={editForm.errors.color}
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
                title="Hapus Bidang"
                message={`Apakah Anda yakin ingin menghapus "${selectedItem?.name}"? Data di bidang ini mungkin akan terpengaruh.`}
            />
        </SupabaseLayout>
    );
}
