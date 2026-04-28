import SupabaseLayout from '@/Layouts/SupabaseLayout';
import SupabaseInput, { SupabaseSelect, SupabaseTextarea } from '@/Components/SupabaseInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Sparkles } from 'lucide-react';

export default function Create({ auth, documentTypes, classifications, subClassifications }) {
    const { data, setData, post, processing, errors } = useForm({
        letter_date: new Date().toISOString().split('T')[0],
        document_type_id: '',
        classification_id: '',
        sub_classification_id: '',
        recipient: '',
        subject: '',
        sequence_number: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('letters.store'));
    };

    return (
        <SupabaseLayout
            user={auth.user}
            header="Registrasi Nomor Surat"
        >
            <Head title="Registrasi Nomor" />

            <div className="max-w-3xl mx-auto">
                <Link
                    href={route('letters.index')}
                    className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Daftar
                </Link>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <Sparkles className="w-5 h-5 text-supabase-brand" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Registrasi Nomor Baru</h3>
                                <p className="text-sm text-slate-500 mt-1">Sistem akan men-generate nomor otomatis berdasarkan pilihan Anda.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <SupabaseInput
                                label="Tanggal Surat"
                                type="date"
                                value={data.letter_date}
                                onChange={(e) => setData('letter_date', e.target.value)}
                                error={errors.letter_date}
                                required
                            />

                            <SupabaseSelect
                                label="Jenis Dokumen"
                                value={data.document_type_id}
                                onChange={(e) => setData('document_type_id', e.target.value)}
                                options={documentTypes}
                                error={errors.document_type_id}
                                required
                            />

                            <SupabaseSelect
                                label="Kualifikasi"
                                value={data.classification_id}
                                onChange={(e) => setData('classification_id', e.target.value)}
                                options={classifications}
                                error={errors.classification_id}
                                required
                            />

                            <SupabaseSelect
                                label="Sub Kualifikasi"
                                value={data.sub_classification_id}
                                onChange={(e) => setData('sub_classification_id', e.target.value)}
                                options={subClassifications}
                                error={errors.sub_classification_id}
                                required
                            />

                            <SupabaseInput
                                label="Nomor Urut Manual"
                                type="number"
                                placeholder="Contoh: 1, 2, dst"
                                value={data.sequence_number}
                                onChange={(e) => setData('sequence_number', e.target.value)}
                                error={errors.sequence_number}
                                required
                            />
                        </div>

                        <div className="space-y-8 pt-4 border-t border-slate-100">
                            <SupabaseInput
                                label="Tujuan / Penerima"
                                placeholder="Contoh: Direktur Utama PT. ABC"
                                value={data.recipient}
                                onChange={(e) => setData('recipient', e.target.value)}
                                error={errors.recipient}
                                required
                            />

                            <SupabaseTextarea
                                label="Perihal"
                                placeholder="Jelaskan isi singkat surat..."
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                error={errors.subject}
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center px-8 py-3 text-sm font-bold text-white bg-supabase-brand rounded-xl hover:bg-supabase-brand-hover transition-all shadow-sm hover:shadow-lg disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Generate & Simpan Nomor
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </SupabaseLayout>
    );
}
